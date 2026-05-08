import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const u = await login(email, password);
      const target =
        loc.state?.from?.pathname ||
        (u.role === "admin" ? "/admin" : "/dashboard");
      nav(target, { replace: true });
    } catch (e) {
      setErr(e.response?.data?.error || "Gagal login");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Selamat Datang Kembali</h2>
        <p className="auth-sub">Masuk ke akun e-Desa Service Anda.</p>

        {err && <div className="error-msg" style={{ marginBottom: 12 }}>{err}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email <span className="req">*</span></label>
            <input
              className="input"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warga@email.com"
            />
          </div>
          <div className="form-group">
            <label>Password <span className="req">*</span></label>
            <input
              className="input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <span className="spinner" /> : "Masuk"}
          </button>
        </form>

        <p className="auth-foot">
          Belum punya akun? <Link to="/register"><b>Daftar di sini</b></Link>
        </p>
      </div>
    </div>
  );
}
