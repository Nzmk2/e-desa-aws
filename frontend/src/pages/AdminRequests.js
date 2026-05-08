import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function AdminRequests() {
  const [list, setList] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterType) params.type = filterType;
    api.get("/requests", { params })
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  }, [filterStatus, filterType]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get("/requests/types/list").then((r) => setTypes(r.data));
  }, []);

  const shown = list.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.pemohon?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      String(r.id).includes(q)
    );
  });

  const resetFilter = () => {
    setFilterStatus("");
    setFilterType("");
    setSearch("");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>📋 Kelola Permohonan</h1>
            <div className="subtitle">Verifikasi, proses, dan kelola semua permohonan warga.</div>
          </div>
          <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
        </div>

        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div className="row" style={{ gap: 10 }}>
            <input
              className="input"
              style={{ flex: 1, minWidth: 200 }}
              placeholder="🔍 Cari nama, email, atau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select"
              style={{ maxWidth: 180 }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option>Diajukan</option>
              <option>Diproses</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
              <option>Selesai</option>
            </select>
            <select
              className="select"
              style={{ maxWidth: 240 }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Semua Jenis Surat</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {(filterStatus || filterType || search) && (
              <button className="btn btn-ghost btn-sm" onClick={resetFilter}>Reset</button>
            )}
          </div>
        </div>

        <div className="row" style={{ marginBottom: 12, fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Menampilkan <b style={{ margin: "0 4px", color: "var(--text)" }}>{shown.length}</b> dari <b style={{ margin: "0 4px", color: "var(--text)" }}>{list.length}</b> permohonan
        </div>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /></div>
        ) : shown.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">📭</div>
            <p>Tidak ada permohonan yang cocok dengan filter.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pemohon</th>
                  <th>Email</th>
                  <th>Jenis Surat</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id}>
                    <td><b>#{r.id}</b></td>
                    <td>{r.pemohon}</td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.email}</td>
                    <td style={{ fontSize: "0.88rem" }}>{r.type}</td>
                    <td style={{ fontSize: "0.88rem" }}>
                      {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <Link to={`/admin/permohonan/${r.id}`} className="btn btn-sm btn-primary">Tinjau</Link>
                    </td>
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
