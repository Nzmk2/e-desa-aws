import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["Umum", "Pengumuman", "Informasi", "Petunjuk", "Kegiatan", "Bantuan Sosial"];

export default function AdminAnnouncements() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category: "Umum" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/announcements")
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", content: "", category: "Umum" });
    setErr("");
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, content: a.content, category: a.category || "Umum" });
    setErr("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/announcements/${editing.id}`, form);
      } else {
        await api.post("/announcements", form);
      }
      closeModal();
      load();
    } catch (e) {
      setErr(e.response?.data?.error || "Gagal menyimpan pengumuman");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Hapus pengumuman "${a.title}"?`)) return;
    try {
      await api.delete(`/announcements/${a.id}`);
      load();
    } catch {
      alert("Gagal menghapus pengumuman");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>📢 Kelola Pengumuman</h1>
            <div className="subtitle">Buat, edit, dan hapus pengumuman desa.</div>
          </div>
          <div className="row">
            <Link to="/admin" className="btn btn-ghost btn-sm">← Dashboard</Link>
            <button className="btn btn-primary" onClick={openCreate}>+ Buat Pengumuman</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /></div>
        ) : list.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">📭</div>
            <p>Belum ada pengumuman. Buat pengumuman pertama Anda.</p>
            <button className="btn btn-primary" onClick={openCreate}>+ Buat Pengumuman</button>
          </div>
        ) : (
          <div className="grid grid-2">
            {list.map((a) => (
              <div key={a.id} className="card">
                <div className="row between" style={{ marginBottom: 8 }}>
                  <span className="badge badge-process">{a.category}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-soft)" }}>
                    {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.05rem" }}>{a.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {a.content}
                </p>
                <div style={{ fontSize: "0.82rem", color: "var(--text-soft)", marginTop: 8 }}>
                  oleh {a.author || "Admin Desa"}
                </div>
                <div className="row" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                  <button className="btn btn-sm" onClick={() => openEdit(a)}>✏️ Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => remove(a)}>🗑️ Hapus</button>
                  <div className="spacer" />
                  <Link to={`/pengumuman/${a.id}`} className="btn btn-sm btn-ghost">Lihat →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? "Edit Pengumuman" : "Buat Pengumuman Baru"}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {editing ? "Perbarui isi pengumuman." : "Pengumuman akan langsung terlihat oleh seluruh warga."}
            </p>

            {err && <div className="error-msg" style={{ marginTop: 12 }}>{err}</div>}

            <form onSubmit={save}>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Kategori</label>
                <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Judul <span className="req">*</span></label>
                <input
                  className="input"
                  required
                  maxLength="200"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Jadwal Posyandu Bulan Ini"
                />
              </div>
              <div className="form-group">
                <label>Isi Pengumuman <span className="req">*</span></label>
                <textarea
                  className="textarea"
                  required
                  rows="6"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis isi pengumuman secara jelas dan lengkap..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : editing ? "Simpan Perubahan" : "Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
