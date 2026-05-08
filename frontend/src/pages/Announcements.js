import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Announcements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/announcements")
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>📢 Pengumuman Desa</h1>
            <div className="subtitle">Informasi resmi & terbaru dari pemerintah desa.</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /> &nbsp;Memuat...</div>
        ) : list.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">📭</div>
            <p>Belum ada pengumuman.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {list.map((a) => (
              <Link
                key={a.id}
                to={`/pengumuman/${a.id}`}
                className="card"
                style={{ display: "block", color: "inherit", textDecoration: "none" }}
              >
                <span className="badge badge-process" style={{ marginBottom: 10 }}>{a.category}</span>
                <h3>{a.title}</h3>
                <p style={{ color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {a.content}
                </p>
                <div className="row between" style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--text-soft)" }}>
                  <span>oleh {a.author || "Admin Desa"}</span>
                  <span>{new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
