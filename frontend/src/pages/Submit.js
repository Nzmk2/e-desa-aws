import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Submit() {
  const nav = useNavigate();
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    api.get("/requests/types/list").then((r) => setTypes(r.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!type) return setErr("Pilih jenis surat terlebih dahulu");
    if (!file) return setErr("Upload dokumen pendukung (KTP/KK)");
    if (file.size > 5 * 1024 * 1024) return setErr("Ukuran file maksimal 5MB");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("type", type);
      fd.append("purpose", purpose);
      fd.append("file", file);
      const { data } = await api.post("/requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(data);
    } catch (e) {
      setErr(e.response?.data?.error || "Gagal mengajukan permohonan");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 600 }}>
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: "4rem", marginBottom: 12 }}>🎉</div>
            <h2>Permohonan Berhasil Diajukan!</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Permohonan Anda telah masuk ke sistem dan akan segera diverifikasi
              oleh admin desa.
            </p>
            <div style={{ background: "var(--primary-50)", padding: 16, borderRadius: "var(--radius)", margin: "20px 0" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Nomor ID Permohonan Anda:</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>#{success.id}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Simpan nomor ini untuk melacak status permohonan.
              </div>
            </div>
            <div className="row" style={{ justifyContent: "center" }}>
              <button className="btn" onClick={() => nav(`/permohonan/${success.id}`)}>
                Lihat Detail
              </button>
              <button className="btn btn-primary" onClick={() => nav("/dashboard")}>
                Ke Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="page-title">
          <div>
            <h1>📝 Ajukan Surat Baru</h1>
            <div className="subtitle">Isi formulir di bawah dengan lengkap dan benar.</div>
          </div>
        </div>

        <div className="card">
          {err && <div className="error-msg" style={{ marginBottom: 14 }}>{err}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Jenis Surat <span className="req">*</span></label>
              <select className="select" value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">-- Pilih jenis surat --</option>
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Keperluan / Tujuan</label>
              <textarea
                className="textarea"
                rows="3"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Contoh: Untuk syarat melamar pekerjaan di PT XYZ"
              />
              <div className="help">Jelaskan keperluan/tujuan pembuatan surat ini.</div>
            </div>

            <div className="form-group">
              <label>Dokumen Pendukung (KTP/KK) <span className="req">*</span></label>
              <label className={`file-input ${file ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="file-icon">{file ? "📄" : "📎"}</div>
                <div>
                  {file ? <b>{file.name}</b> : <b>Klik untuk pilih file</b>}
                </div>
                <span className="file-label">
                  {file
                    ? `${(file.size / 1024).toFixed(0)} KB · klik untuk ganti`
                    : "JPG, PNG, atau PDF (maks 5MB)"}
                </span>
              </label>
              <div className="help">
                Pastikan dokumen jelas dan terbaca. Dokumen Anda hanya dapat
                diakses oleh admin yang berwenang.
              </div>
            </div>

            <div className="row" style={{ marginTop: 20 }}>
              <button type="button" className="btn" onClick={() => nav("/dashboard")}>
                Batal
              </button>
              <div className="spacer" />
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? <><span className="spinner" /> &nbsp;Mengirim...</> : "Ajukan Permohonan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
