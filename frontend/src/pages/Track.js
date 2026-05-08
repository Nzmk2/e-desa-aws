import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";

export default function Track() {
  const { id: paramId } = useParams();
  const nav = useNavigate();
  const [trackId, setTrackId] = useState(paramId || "");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (id) => {
    if (!id) return;
    setErr("");
    setLoading(true);
    setData(null);
    try {
      const r = await api.get(`/requests/track/${id}`);
      setData(r.data);
    } catch (e) {
      setErr(e.response?.data?.error || "Permohonan tidak ditemukan");
    } finally { setLoading(false); }
  };

  useEffect(() => { if (paramId) lookup(paramId); /* eslint-disable-next-line */ }, [paramId]);

  const submit = (e) => {
    e.preventDefault();
    nav(`/lacak/${trackId.trim()}`);
    lookup(trackId.trim());
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-title">
          <div>
            <h1>📍 Lacak Permohonan</h1>
            <div className="subtitle">Cek status permohonan surat menggunakan nomor ID.</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <form onSubmit={submit} className="row" style={{ gap: 10 }}>
            <input
              className="input"
              style={{ flex: 1, minWidth: 200 }}
              placeholder="Masukkan ID Permohonan (contoh: 12)"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              type="number"
              min="1"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : "Cari"}
            </button>
          </form>
          <p className="help" style={{ marginTop: 10 }}>
            ID Permohonan diberikan saat Anda mengajukan surat. Simpan baik-baik.
          </p>
        </div>

        {err && <div className="error-msg">{err}</div>}

        {data && (
          <div className="card">
            <div className="row between" style={{ alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  ID Permohonan #{data.id}
                </div>
                <h2 style={{ margin: "4px 0 6px" }}>{data.type}</h2>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Pemohon: <b>{data.pemohon}</b>
                </div>
              </div>
              <StatusBadge status={data.status} />
            </div>

            {data.admin_notes && (
              <div style={{ background: "var(--bg)", padding: 12, borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: "0.9rem" }}>
                <b>Catatan Admin:</b> {data.admin_notes}
              </div>
            )}

            <h3 style={{ fontSize: "1rem", marginBottom: 14 }}>Riwayat Status</h3>
            <div className="timeline">
              {data.history?.map((h, idx) => (
                <div key={idx} className="tl-item">
                  <div className="tl-dot" />
                  <div className="tl-time">
                    {new Date(h.created_at).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="tl-status">{h.status}</div>
                  {h.notes && <div className="tl-notes">{h.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
