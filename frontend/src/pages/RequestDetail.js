import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Diajukan", "Diproses", "Disetujui", "Ditolak", "Selesai"];

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = () => {
    api.get(`/requests/${id}`)
      .then((r) => {
        setData(r.data);
        setNewStatus(r.data.status);
        setNotes(r.data.admin_notes || "");
      })
      .catch((e) => setErr(e.response?.data?.error || "Gagal memuat"));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const updateStatus = async () => {
    setUpdating(true);
    try {
      await api.put(`/requests/${id}/status`, { status: newStatus, notes });
      setShowStatusModal(false);
      load();
    } catch (e) {
      alert(e.response?.data?.error || "Gagal update");
    } finally { setUpdating(false); }
  };

  if (err) return <div className="page"><div className="container"><div className="card empty"><div className="empty-icon">😕</div><p>{err}</p></div></div></div>;
  if (!data) return <div className="loading-screen"><span className="spinner" /></div>;

  const isAdmin = user?.role === "admin";

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ marginBottom: 16 }}>
          ← Kembali
        </button>

        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <div className="card">
            <div className="row between" style={{ alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Permohonan #{data.id}</div>
                <h2 style={{ margin: "4px 0" }}>{data.type}</h2>
              </div>
              <StatusBadge status={data.status} />
            </div>

            <div className="grid grid-2" style={{ gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Pemohon</div>
                <div><b>{data.pemohon}</b></div>
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Tanggal Ajukan</div>
                <div>{new Date(data.created_at).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}</div>
              </div>
              {isAdmin && (
                <>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Email</div>
                    <div>{data.pemohon_email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>NIK</div>
                    <div>{data.nik || "-"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Telepon</div>
                    <div>{data.phone || "-"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Alamat</div>
                    <div>{data.address || "-"}</div>
                  </div>
                </>
              )}
            </div>

            {data.purpose && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Keperluan</div>
                <div>{data.purpose}</div>
              </div>
            )}

            {data.admin_notes && (
              <div style={{ background: "var(--bg)", padding: 14, borderRadius: "var(--radius)", marginBottom: 16 }}>
                <b style={{ fontSize: "0.88rem" }}>📌 Catatan Admin</b>
                <p style={{ marginTop: 6, marginBottom: 0, fontSize: "0.93rem" }}>{data.admin_notes}</p>
              </div>
            )}

            {data.document_url && (
              <div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>Dokumen Pendukung</div>
                <a href={data.document_url} target="_blank" rel="noreferrer" className="btn">
                  📄 Lihat Dokumen
                </a>
                <div className="help">Link berlaku 15 menit untuk keamanan.</div>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Riwayat Status</h3>
              <div className="timeline">
                {data.history?.map((h, idx) => (
                  <div key={idx} className="tl-item">
                    <div className="tl-dot" />
                    <div className="tl-time">
                      {new Date(h.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                    <div className="tl-status">{h.status}</div>
                    {h.notes && <div className="tl-notes">{h.notes}</div>}
                  </div>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="card">
                <h3 style={{ fontSize: "1rem", marginBottom: 12 }}>Aksi Admin</h3>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setShowStatusModal(true)}
                >
                  Ubah Status
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showStatusModal && (
        <div className="modal-backdrop" onClick={() => setShowStatusModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Ubah Status Permohonan</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Permohonan #{data.id} - {data.type}
            </p>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Status Baru</label>
              <select className="select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Catatan untuk Pemohon</label>
              <textarea
                className="textarea"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Dokumen kurang jelas, mohon upload ulang."
              />
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => setShowStatusModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={updateStatus} disabled={updating}>
                {updating ? <span className="spinner" /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
