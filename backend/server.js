require("dotenv").config();
const express = require("express");
const cors = require("cors");

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]:", err);
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// health-check
app.get("/api/health", (_, res) => res.json({ status: "OK", service: "edesa-backend" }));

// helper
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.locals.asyncH = asyncH;

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/admin", require("./routes/admin"));

// 404
app.use("/api", (_, res) => res.status(404).json({ error: "Endpoint tidak ditemukan" }));

// error handler global
app.use((err, req, res, next) => {
  console.error("[error]:", err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Ukuran file terlalu besar (maks 5MB)" });
  }
  if (err.code === "ER_ACCESS_DENIED_ERROR" || err.code === "ECONNREFUSED") {
    return res.status(503).json({ error: "Database tidak dapat diakses sementara" });
  }
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

(async () => {
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