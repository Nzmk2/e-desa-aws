const express = require("express");
const pool = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// public list
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id,a.title,a.content,a.category,a.created_at,
              u.name AS author
       FROM announcements a LEFT JOIN users u ON a.created_by=u.id
       ORDER BY a.id DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS author
       FROM announcements a LEFT JOIN users u ON a.created_by=u.id
       WHERE a.id=?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// admin create / edit / delete
router.post("/", auth, adminOnly, async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Judul dan konten wajib" });
    const [r] = await pool.query(
      "INSERT INTO announcements (title,content,category,created_by) VALUES (?,?,?,?)",
      [title, content, category || "Umum", req.user.id]
    );
    res.json({ id: r.insertId, title, content, category });
  } catch (err) { next(err); }
});

router.put("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    await pool.query(
      "UPDATE announcements SET title=?,content=?,category=? WHERE id=?",
      [title, content, category, req.params.id]
    );
    res.json({ message: "Pengumuman diperbarui" });
  } catch (err) { next(err); }
});

router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM announcements WHERE id=?", [req.params.id]);
    res.json({ message: "Pengumuman dihapus" });
  } catch (err) { next(err); }
});

module.exports = router;