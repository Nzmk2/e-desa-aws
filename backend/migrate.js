const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function migrate() {
  const sqlPath = path.join(__dirname, "schema.sql");
  if (!fs.existsSync(sqlPath)) {
    console.warn("[migrate] schema.sql tidak ditemukan, skip migration");
    return;
  }
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("[migrate] Connecting to DB for migration...");
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true,
    connectTimeout: 15000,
  });

  try {
    console.log("[migrate] Applying schema.sql ...");
    await conn.query(sql);
    console.log("[migrate] ✓ Schema applied successfully");
  } finally {
    await conn.end();
  }
}

module.exports = migrate;