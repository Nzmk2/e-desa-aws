const express = require("express");
const multer = require("multer");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const pool = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();
const s3 = new S3Client({ region: process.env.AWS_REGION });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const VALID_TYPES = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Usaha",
  "Surat Keterangan Tidak Mampu",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Surat Pengantar Pindah",
  "Surat Pengantar KTP/KK",
  "Surat Pengantar Nikah",
];

// helper: signed URL untuk dokumen (privasi KTP/KK)
async function makeSignedUrl(key) {
  if (!key) return null;
  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
    { expiresIn: 60 * 15 } // 15 menit
  );
}

// ===== POST /api/requests : ajukan surat =====
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const { type, purpose } = req.body;
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: "Jenis surat tidak valid" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Dokumen pendukung (KTP/KK) wajib diupload" });
    }

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileKey = `uploads/${req.user.id}/${Date.now()}-${safeName}`;

    await new Upload({
      client: s3,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      },
    }).done();

    const [r] = await pool.query(
      "INSERT INTO requests (user_id,type,purpose,status,document_key) VALUES (?,?,?, 'Diajukan', ?)",
      [req.user.id, type, purpose || null, fileKey]
    );

    await pool.query(
      "INSERT INTO status_history (request_id,status,notes,changed_by) VALUES (?, 'Diajukan', ?, ?)",
      [r.insertId, "Permohonan diterima sistem", req.user.id]
    );

    res.json({
      id: r.insertId,
      type,
      purpose,
      status: "Diajukan",
      message: "Permohonan berhasil diajukan",
    });
  } catch (err) {
    console.error("submit error:", err);
    res.status(500).json({ error: "Gagal mengajukan permohonan" });
  }
});

// ===== GET /api/requests/mine : permohonan milik user yg login =====
router.get("/mine", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, type, purpose, status, created_at, updated_at
     FROM requests WHERE user_id=? ORDER BY id DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// ===== GET /api/requests/track/:id : tracking publik (tanpa login) =====
router.get("/track/:id", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.type, r.status, r.created_at, r.updated_at, r.admin_notes,
            u.name AS pemohon
     FROM requests r JOIN users u ON r.user_id=u.id
     WHERE r.id=?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Permohonan tidak ditemukan" });

  const [history] = await pool.query(
    "SELECT status,notes,created_at FROM status_history WHERE request_id=? ORDER BY id ASC",
    [req.params.id]
  );

  res.json({ ...rows[0], history });
});

// ===== GET /api/requests/:id : detail (owner atau admin) =====
router.get("/:id", auth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.name AS pemohon, u.email AS pemohon_email, u.nik, u.phone, u.address
     FROM requests r JOIN users u ON r.user_id=u.id WHERE r.id=?`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Tidak ditemukan" });

  const r = rows[0];
  if (req.user.role !== "admin" && r.user_id !== req.user.id) {
    return res.status(403).json({ error: "Tidak diizinkan" });
  }

  const [history] = await pool.query(
    "SELECT status,notes,created_at FROM status_history WHERE request_id=? ORDER BY id ASC",
    [req.params.id]
  );

  const document_url = await makeSignedUrl(r.document_key);
  res.json({ ...r, document_url, history });
});

// ===== GET /api/requests : list semua (admin) =====
router.get("/", auth, adminOnly, async (req, res) => {
  const { status, type } = req.query;
  let sql = `SELECT r.id, r.type, r.status, r.created_at, r.updated_at,
                    u.name AS pemohon, u.email
             FROM requests r JOIN users u ON r.user_id=u.id`;
  const where = [];
  const params = [];
  if (status) { where.push("r.status=?"); params.push(status); }
  if (type)   { where.push("r.type=?");   params.push(type); }
  if (where.length) sql += " WHERE " + where.join(" AND ");
  sql += " ORDER BY r.id DESC";
  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// ===== PUT /api/requests/:id/status : admin update =====
router.put("/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const ALLOWED = ["Diajukan", "Diproses", "Disetujui", "Ditolak", "Selesai"];
    if (!ALLOWED.includes(status)) return res.status(400).json({ error: "Status tidak valid" });

    await pool.query(
      "UPDATE requests SET status=?, admin_notes=? WHERE id=?",
      [status, notes || null, req.params.id]
    );
    await pool.query(
      "INSERT INTO status_history (request_id,status,notes,changed_by) VALUES (?,?,?,?)",
      [req.params.id, status, notes || null, req.user.id]
    );

    res.json({ message: "Status berhasil diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update status" });
  }
});

// ===== GET /api/requests/:id/document : download/lihat dokumen (signed URL) =====
router.get("/:id/document", auth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT user_id, document_key FROM requests WHERE id=?",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Tidak ditemukan" });
  if (req.user.role !== "admin" && rows[0].user_id !== req.user.id) {
    return res.status(403).json({ error: "Tidak diizinkan" });
  }
  const url = await makeSignedUrl(rows[0].document_key);
  res.json({ url });
});

// ===== GET /api/requests/types/list : daftar jenis surat =====
router.get("/types/list", (req, res) => res.json(VALID_TYPES));

module.exports = router;
