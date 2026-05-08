import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", nik: "", phone: "", address: "" });
  const [pw, setPw] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then((r) => {
      setForm({
        name: r.data.name || "",
        nik: r.data.nik || "",
        phone: r.data.phone || "",
        address: r.data.address || "",
      });
    });
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setP = (k) => (e) => setPw({ ...pw, [k]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (form.nik && !/^\d{16}$/.test(form.nik)) return setErr("NIK harus 16 digit angka");
    setSaving(true);
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser({ ...user, ...data });
      setMsg("Profil berhasil diperbarui");
    } catch (e) {
      setErr(e.response?.data?.error || "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg(""); setPwErr("");
    if (pw.newPassword !== pw.confirm) return setPwErr("Konfirmasi password tidak cocok");
    if (pw.newPassword.length < 6) return setPwErr("Password baru minimal 6 karakter");
    try {
      await api.put("/auth/me/password", {
        oldPassword: pw.oldPassword,
        newPassword: pw.newPassword,
      });
      setPw({ oldPassword: "", newPassword: "", confirm: "" });
      setPwMsg("Password berhasil diubah");
    } catch (e) {
      setPwErr(e.response?.data?.error || "Gagal mengubah password");
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-title">
          <div>
            <h1>👤 Profil Saya</h1>
            <div className="subtitle">Kelola informasi akun & ubah password.</div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Informasi Akun</h3>
            {msg && <div className="success-msg">{msg}</div>}
            {err && <div className="error-msg" style={{ marginBottom: 12 }}>{err}</div>}

            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label>Email</label>
                <input className="input" value={user?.email || ""} disabled />
                <div className="help">Email tidak dapat diubah.</div>
              </div>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input className="input" value={form.name} onChange={set("name")} required />
              </div>
              <div className="form-group">
                <label>NIK (16 digit)</label>
                <input className="input" maxLength="16" value={form.nik} onChange={set("nik")} />
              </div>
              <div className="form-group">
                <label>Nomor HP</label>
                <input className="input" type="tel" value={form.phone} onChange={set("phone")} />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <textarea className="textarea" rows="3" value={form.address} onChange={set("address")} />
              </div>
              <button className="btn btn-primary" disabled={saving}>
                {saving ? <span className="spinner" /> : "Simpan Perubahan"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Ubah Password</h3>
            {pwMsg && <div className="success-msg">{pwMsg}</div>}
            {pwErr && <div className="error-msg" style={{ marginBottom: 12 }}>{pwErr}</div>}

            <form onSubmit={changePassword}>
              <div className="form-group">
                <label>Password Lama</label>
                <input className="input" type="password" value={pw.oldPassword} onChange={setP("oldPassword")} required />
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input className="input" type="password" minLength="6" value={pw.newPassword} onChange={setP("newPassword")} required />
                <div className="help">Minimal 6 karakter.</div>
              </div>
              <div className="form-group">
                <label>Konfirmasi Password Baru</label>
                <input className="input" type="password" value={pw.confirm} onChange={setP("confirm")} required />
              </div>
              <button className="btn btn-primary">Ubah Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
