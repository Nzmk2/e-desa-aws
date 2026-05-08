import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function UserDashboard() {
  const { user } = useAuth();
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/requests/mine")
      .then((r) => setReqs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const total = reqs.length;
  const pending = reqs.filter((r) => ["Diajukan", "Diproses"].includes(r.status)).length;
  const done = reqs.filter((r) => ["Disetujui", "Selesai"].includes(r.status)).length;
  const rejected = reqs.filter((r) => r.status === "Ditolak").length;
  const recent = reqs.slice(0, 5);

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>Halo, {user?.name?.split(" ")[0]} 👋</h1>
            <div className="subtitle">Selamat datang di dashboard layanan desa Anda.</div>
          </div>
          <Link to="/ajukan" className="btn btn-primary btn-lg">+ Ajukan Surat Baru</Link>
        </div>

        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          <div className="stat">
            <div className="stat-icon blue">📋</div>
            <div>
              <div className="stat-num">{total}</div>
              <div className="stat-lbl">Total Permohonan</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon amber">⏳</div>
            <div>
              <div className="stat-num">{pending}</div>
              <div className="stat-lbl">Sedang Diproses</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon green">✅</div>
            <div>
              <div className="stat-num">{done}</div>
              <div className="stat-lbl">Disetujui / Selesai</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon purple">❌</div>
            <div>
              <div className="stat-num">{rejected}</div>
              <div className="stat-lbl">Ditolak</div>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <h3>Permohonan Terbaru</h3>
              {reqs.length > 5 && <Link to="/permohonan" className="btn btn-sm">Lihat Semua →</Link>}
            </div>
            {loading ? (
              <div className="loading-screen"><span className="spinner" /></div>
            ) : recent.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📝</div>
                <p>Anda belum mengajukan permohonan apapun.</p>
                <Link to="/ajukan" className="btn btn-primary">Ajukan Sekarang</Link>
              </div>
            ) : (
              <div className="table-wrap" style={{ border: 0 }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Jenis Surat</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r) => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.type}</td>
                        <td>{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td><Link to={`/permohonan/${r.id}`} className="btn btn-sm">Detail</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: "1rem" }}>Akses Cepat</h3>
              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                <Link to="/ajukan" className="btn btn-block">📝 Ajukan Surat</Link>
                <Link to="/permohonan" className="btn btn-block">📋 Riwayat Permohonan</Link>
                <Link to="/lacak" className="btn btn-block">📍 Lacak Permohonan</Link>
                <Link to="/profil" className="btn btn-block">👤 Profil Saya</Link>
              </div>
            </div>

            <div className="card" style={{ background: "var(--primary-50)", borderColor: "var(--primary-100)" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--primary)" }}>💡 Tips</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>
                Lengkapi profil Anda (NIK, alamat) untuk mempercepat proses verifikasi
                permohonan. <Link to="/profil"><b>Lengkapi sekarang →</b></Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
