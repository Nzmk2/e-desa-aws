import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function MyRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.get("/requests/mine")
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  }, []);

  const shown = filter ? list.filter((r) => r.status === filter) : list;

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>📋 Riwayat Permohonan</h1>
            <div className="subtitle">Daftar semua permohonan yang pernah Anda ajukan.</div>
          </div>
          <Link to="/ajukan" className="btn btn-primary">+ Ajukan Baru</Link>
        </div>

        <div className="row" style={{ marginBottom: 16 }}>
          <select className="select" style={{ maxWidth: 220 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Semua Status</option>
            <option>Diajukan</option>
            <option>Diproses</option>
            <option>Disetujui</option>
            <option>Ditolak</option>
            <option>Selesai</option>
          </select>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Total: <b>{shown.length}</b> permohonan
          </span>
        </div>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /></div>
        ) : shown.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">📭</div>
            <p>Belum ada permohonan{filter && ` dengan status "${filter}"`}.</p>
            <Link to="/ajukan" className="btn btn-primary">Ajukan Sekarang</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Jenis Surat</th>
                  <th>Tanggal Ajukan</th>
                  <th>Update Terakhir</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id}>
                    <td><b>#{r.id}</b></td>
                    <td>{r.type}</td>
                    <td>{new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>{new Date(r.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td><Link to={`/permohonan/${r.id}`} className="btn btn-sm">Detail</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
