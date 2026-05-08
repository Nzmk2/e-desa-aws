import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
    nik: "", phone: "", address: "",
  });
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm) {
      return setErr("Konfirmasi password tidak cocok");
    }
    if (form.nik && !/^\d{16}$/.test(form.nik)) {
      return setErr("NIK harus 16 digit angka");
    }
    try {
      const { confirm, ...payload } = form;
      await register(payload);
      nav("/dashboard", { replace: true });
    } catch (e) {
      setErr(e.response?.data?.error || "Gagal mendaftar");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: 540 }}>
        <h2>Daftar Akun Warga</h2>
        <p className="auth-sub">Daftar untuk dapat mengajukan surat & melacak permohonan.</p>

        {err && <div className="error-msg" style={{ marginBottom: 12 }}>{err}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Nama Lengkap <span className="req">*</span></label>
            <input className="input" required value={form.name} onChange={set("name")} placeholder="Sesuai KTP" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email <span className="req">*</span></label>
              <input className="input" type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className="form-group">
              <label>Nomor HP</label>
              <input className="input" type="tel" value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div className="form-group">
            <label>NIK (16 digit)</label>
            <input className="input" maxLength="16" value={form.nik} onChange={set("nik")} placeholder="3xxxxxxxxxxxxxxx" />
            <div className="help">Opsional, tapi disarankan untuk mempercepat verifikasi.</div>
          </div>

          <div className="form-group">
            <label>Alamat</label>
            <textarea className="textarea" rows="2" value={form.address} onChange={set("address")} placeholder="Dusun/RT/RW/Desa" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password <span className="req">*</span></label>
              <input className="input" type="password" required minLength="6" value={form.password} onChange={set("password")} />
              <div className="help">Minimal 6 karakter</div>
            </div>
            <div className="form-group">
              <label>Konfirmasi Password <span className="req">*</span></label>
              <input className="input" type="password" required value={form.confirm} onChange={set("confirm")} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : "Daftar Sekarang"}
          </button>
        </form>

        <p className="auth-foot">
          Sudah punya akun? <Link to="/login"><b>Masuk di sini</b></Link>
        </p>
      </div>
    </div>
  );
}
