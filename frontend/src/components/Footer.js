import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>e-Desa Service</h4>
            <p>
              Sistem layanan administrasi desa berbasis online. Pengajuan surat,
              tracking status, dan pengumuman desa kapan saja, di mana saja.
            </p>
          </div>
          <div>
            <h4>Navigasi</h4>
            <Link to="/">Beranda</Link>
            <Link to="/pengumuman">Pengumuman</Link>
            <Link to="/lacak">Lacak Permohonan</Link>
            <Link to="/tentang">Tentang Desa</Link>
          </div>
          <div>
            <h4>Kontak</h4>
            <p>Kantor Desa<br/>Jl. Raya Desa No. 1</p>
            <p>📞 (021) 1234-5678</p>
            <p>✉️ info@edesa.id</p>
            <p>🕐 Sen-Jum 08:00-16:00</p>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} e-Desa Service · Pemerintah Desa
        </div>
      </div>
    </footer>
  );
}
