const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ----- Register -----
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, nik, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nama, email, dan password wajib diisi" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter" });
    }

    const [exists] = await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length) {
      return res.status(409).json({ error: "Email sudah terdaftar" });
    }

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      "INSERT INTO users (name,email,password,nik,phone,address,role) VALUES (?,?,?,?,?,?, 'user')",
      [name, email, hash, nik || null, phone || null, address || null]
    );

    const token = jwt.sign(
      { id: r.insertId, role: "user", name, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    res.json({
      token,
      user: { id: r.insertId, name, email, role: "user", nik, phone, address },
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "Gagal mendaftar" });
  }
});

// ----- Login -----
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email dan password wajib" });

    const [rows] = await pool.query(
      "SELECT id, name, email, password, role, nik, phone, address FROM users WHERE email=?",
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: "Email atau password salah" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Email atau password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "7d" }
    );

    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Gagal login" });
  }
});

// ----- Current user -----
router.get("/me", auth, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id,name,email,role,nik,phone,address,created_at FROM users WHERE id=?",
    [req.user.id]
  );
  res.json(rows[0] || null);
});

// ----- Update profile -----
router.put("/me", auth, async (req, res) => {
  try {
    const { name, nik, phone, address } = req.body;
    await pool.query(
      "UPDATE users SET name=COALESCE(?,name), nik=?, phone=?, address=? WHERE id=?",
      [name, nik || null, phone || null, address || null, req.user.id]
    );
    const [rows] = await pool.query(
      "SELECT id,name,email,role,nik,phone,address FROM users WHERE id=?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update profil" });
  }
});

// ----- Change password -----
router.put("/me/password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: "Data tidak lengkap" });
    if (newPassword.length < 6) return res.status(400).json({ error: "Password baru minimal 6 karakter" });

    const [rows] = await pool.query("SELECT password FROM users WHERE id=?", [req.user.id]);
    const ok = await bcrypt.compare(oldPassword, rows[0].password);
    if (!ok) return res.status(401).json({ error: "Password lama salah" });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password=? WHERE id=?", [hash, req.user.id]);
    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal ubah password" });
  }
});

module.exports = router;
