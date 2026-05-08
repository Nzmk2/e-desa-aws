import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 540, textAlign: "center" }}>
        <div className="card" style={{ padding: 48 }}>
          <div style={{ fontSize: "5rem", marginBottom: 8 }}>🔍</div>
          <h1 style={{ fontSize: "2.6rem", marginBottom: 4 }}>404</h1>
          <h2 style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: 20 }}>
            Halaman Tidak Ditemukan
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link to="/" className="btn btn-primary">🏠 Beranda</Link>
            <Link to="/lacak" className="btn">📍 Lacak Permohonan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
