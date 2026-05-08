import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    api.get("/admin/users")
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  }, []);

  const shown = list.filter((u) => {
    if (filterRole && u.role !== filterRole) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.nik?.includes(q)
    );
  });

  const totalUsers = list.filter((u) => u.role === "user").length;
  const totalAdmins = list.filter((u) => u.role === "admin").length;

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>👥 Kelola Warga</h1>
            <div className="subtitle">Daftar seluruh warga yang terdaftar di sistem.</div>
          </div>
          <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 20 }}>
          <div className="stat">
            <div className="stat-icon blue">👤</div>
            <div>
              <div className="stat-num">{list.length}</div>
              <div className="stat-lbl">Total Akun</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon green">🏘️</div>
            <div>
              <div className="stat-num">{totalUsers}</div>
              <div className="stat-lbl">Warga Terdaftar</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon purple">🛡️</div>
            <div>
              <div className="stat-num">{totalAdmins}</div>
              <div className="stat-lbl">Admin</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16, padding: 16 }}>
          <div className="row" style={{ gap: 10 }}>
            <input
              className="input"
              style={{ flex: 1, minWidth: 200 }}
              placeholder="🔍 Cari nama, email, atau NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select"
              style={{ maxWidth: 180 }}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Semua Role</option>
              <option value="user">Warga</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /></div>
        ) : shown.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">📭</div>
            <p>Tidak ada warga yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>NIK</th>
                  <th>Telepon</th>
                  <th>Role</th>
                  <th>Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><b>{u.name}</b></td>
                    <td style={{ fontSize: "0.88rem" }}>{u.email}</td>
                    <td style={{ fontSize: "0.88rem" }}>{u.nik || "-"}</td>
                    <td style={{ fontSize: "0.88rem" }}>{u.phone || "-"}</td>
                    <td>
                      <span className={`badge ${u.role === "admin" ? "badge-done" : "badge-process"}`}>
                        {u.role === "admin" ? "🛡️ Admin" : "🏘️ Warga"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
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
