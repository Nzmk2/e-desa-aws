import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const initials = user
    ? user.name.split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase()
    : "";

  const handleLogout = () => {
    logout();
    close();
    nav("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand" onClick={close}>
          <div className="brand-mark">eD</div>
          <div className="brand-text">
            <span>e-Desa Service</span>
            <small>Layanan Desa Online</small>
          </div>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Beranda</NavLink>
          <NavLink to="/pengumuman" onClick={close}>Pengumuman</NavLink>
          <NavLink to="/lacak" onClick={close}>Lacak Permohonan</NavLink>
          <NavLink to="/tentang" onClick={close}>Tentang Desa</NavLink>

          {user?.role === "user" && (
            <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={close}>Admin</NavLink>
          )}
        </div>

        <div className="nav-right">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
            </>
          ) : (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="user-chip"
              >
                <span className="user-avatar">{initials}</span>
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Keluar
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
