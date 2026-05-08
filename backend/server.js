require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// health-check
app.get("/api/health", (_, res) => res.json({ status: "OK", service: "edesa-backend" }));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/admin", require("./routes/admin"));

// 404
app.use("/api", (_, res) => res.status(404).json({ error: "Endpoint tidak ditemukan" }));

// error handler
app.use((err, req, res, next) => {
  console.error("unhandled:", err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Ukuran file terlalu besar (maks 5MB)" });
  }
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

(async () => {
  // Auto-migrate database (default: ON, set AUTO_MIGRATE=false untuk disable)
  if (process.env.AUTO_MIGRATE !== "false") {
    try {
      await require("./migrate")();
    } catch (e) {
      console.error("[migrate] FAILED (server tetap start):", e.message);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`e-Desa backend listening on :${PORT}`);
  });
})();