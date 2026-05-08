import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
  }, []);

  if (!stats) return <div className="loading-screen"><span className="spinner" /></div>;

  const sCount = (s) => stats.byStatus.find((x) => x.status === s)?.jumlah || 0;

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>🛡️ Dashboard Admin</h1>
            <div className="subtitle">Ringkasan dan kelola layanan e-Desa.</div>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          <div className="stat">
            <div className="stat-icon blue">👥</div>
            <div>
              <div className="stat-num">{stats.totalUsers}</div>
              <div className="stat-lbl">Total Warga Terdaftar</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon green">📋</div>
            <div>
              <div className="stat-num">{stats.totalRequests}</div>
              <div className="stat-lbl">Total Permohonan</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon amber">⏳</div>
            <div>
              <div className="stat-num">{sCount("Diajukan") + sCount("Diproses")}</div>
              <div className="stat-lbl">Menunggu Diproses</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon purple">✅</div>
            <div>
              <div className="stat-num">{sCount("Disetujui") + sCount("Selesai")}</div>
              <div className="stat-lbl">Telah Diselesaikan</div>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3>Permohonan Terbaru</h3>
              <Link to="/admin/permohonan" className="btn btn-sm">Lihat Semua →</Link>
            </div>
            {stats.recent.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <p>Belum ada permohonan masuk.</p>
              </div>
            ) : (
              <div className="table-wrap" style={{ border: 0 }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Pemohon</th>
                      <th>Jenis</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((r) => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.pemohon}</td>
                        <td style={{ fontSize: "0.85rem" }}>{r.type}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td><Link to={`/admin/permohonan/${r.id}`} className="btn btn-sm">Tinjau</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Distribusi Status</h3>
              {stats.byStatus.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Belum ada data.</p>
              ) : stats.byStatus.map((s) => (
                <div key={s.status} className="row between" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <StatusBadge status={s.status} />
                  <b>{s.jumlah}</b>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Jenis Surat Terpopuler</h3>
              {stats.byType.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Belum ada data.</p>
              ) : stats.byType.slice(0, 5).map((s) => (
                <div key={s.type} className="row between" style={{ padding: "6px 0", fontSize: "0.88rem" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                    {s.type}
                  </span>
                  <b>{s.jumlah}</b>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Manajemen</h3>
              <div style={{ display: "grid", gap: 8 }}>
                <Link to="/admin/permohonan" className="btn btn-block">📋 Kelola Permohonan</Link>
                <Link to="/admin/users" className="btn btn-block">👥 Kelola Warga</Link>
                <Link to="/admin/pengumuman" className="btn btn-block">📢 Kelola Pengumuman</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
