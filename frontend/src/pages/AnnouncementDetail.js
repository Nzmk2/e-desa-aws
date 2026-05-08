import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/announcements/${id}`)
      .then((r) => setData(r.data))
      .catch(() => setErr("Pengumuman tidak ditemukan"));
  }, [id]);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/pengumuman" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
          ← Kembali
        </Link>
        {err ? (
          <div className="card empty">
            <div className="empty-icon">😕</div>
            <p>{err}</p>
          </div>
        ) : !data ? (
          <div className="loading-screen"><span className="spinner" /></div>
        ) : (
          <div className="card">
            <span className="badge badge-process">{data.category}</span>
            <h1 style={{ marginTop: 12 }}>{data.title}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 24 }}>
              Diposting oleh <b>{data.author || "Admin Desa"}</b> pada{" "}
              {new Date(data.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{data.content}</div>
          </div>
        )}
      </div>
    </div>
  );
}
