const express = require("express");
const pool = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// dashboard stats
router.get("/stats", auth, adminOnly, async (req, res) => {
  const [[users]] = await pool.query(
    "SELECT COUNT(*) AS total FROM users WHERE role='user'"
  );
  const [[total]] = await pool.query("SELECT COUNT(*) AS total FROM requests");
  const [byStatus] = await pool.query(
    "SELECT status, COUNT(*) AS jumlah FROM requests GROUP BY status"
  );
  const [byType] = await pool.query(
    "SELECT type, COUNT(*) AS jumlah FROM requests GROUP BY type ORDER BY jumlah DESC"
  );
  const [recent] = await pool.query(
    `SELECT r.id,r.type,r.status,r.created_at,u.name AS pemohon
     FROM requests r JOIN users u ON r.user_id=u.id
     ORDER BY r.id DESC LIMIT 5`
  );
  res.json({
    totalUsers: users.total,
    totalRequests: total.total,
    byStatus,
    byType,
    recent,
  });
});

// users list (admin)
router.get("/users", auth, adminOnly, async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id,name,email,role,nik,phone,created_at FROM users ORDER BY id DESC"
  );
  res.json(rows);
});

module.exports = router;
