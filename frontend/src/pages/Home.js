import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "📝", title: "Pengajuan Surat", desc: "Ajukan surat-menyurat desa secara online dari rumah, tanpa antri." },
  { icon: "📍", title: "Lacak Permohonan", desc: "Pantau status permohonan Anda dengan timeline yang jelas." },
  { icon: "📂", title: "Upload Dokumen", desc: "Unggah scan KTP/KK dengan aman dan terenkripsi." },
  { icon: "📢", title: "Pengumuman Desa", desc: "Informasi resmi & terbaru dari Pemerintah Desa." },
  { icon: "👥", title: "Akun Warga", desc: "Riwayat permohonan tersimpan di akun pribadi Anda." },
  { icon: "✅", title: "Verifikasi Admin", desc: "Diverifikasi langsung oleh perangkat desa berwenang." },
];

const SURATS = [
  "Surat Keterangan Domisili",
  "Surat Keterangan Usaha",
  "Surat Keterangan Tidak Mampu (SKTM)",
  "Surat Keterangan Kelahiran",
  "Surat Keterangan Kematian",
  "Surat Pengantar Pindah",
  "Surat Pengantar KTP/KK",
  "Surat Pengantar Nikah",
];

export default function Home() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/announcements").then((r) => setNews(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Layanan Desa, Sekarang Lebih Mudah & Cepat</h1>
          <p>
            Ajukan surat-menyurat dan dokumen administrasi desa secara online.
            Tanpa antri, tanpa repot, kapan saja dari mana saja.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="btn btn-primary btn-lg">
                Buka Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Daftar Sekarang
                </Link>
                <Link to="/lacak" className="btn btn-outline btn-lg">
                  Lacak Permohonan
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Apa yang Bisa Anda Lakukan?</h2>
            <p>Berbagai layanan administrasi desa kini dapat diakses online dengan mudah.</p>
          </div>
          <div className="grid grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "white", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-title">
            <h2>Jenis Surat yang Tersedia</h2>
            <p>Berbagai keperluan administrasi warga desa terlayani melalui sistem ini.</p>
          </div>
          <div className="grid grid-4" style={{ gap: 12 }}>
            {SURATS.map((s) => (
              <div key={s} className="card" style={{ padding: 16, textAlign: "center", fontSize: "0.9rem", fontWeight: 500 }}>
                📄 {s}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to={user ? "/ajukan" : "/login"} className="btn btn-primary btn-lg">
              {user ? "Ajukan Surat Sekarang" : "Masuk untuk Mengajukan"}
            </Link>
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="row between" style={{ marginBottom: 24 }}>
              <div>
                <h2 style={{ marginBottom: 4 }}>Pengumuman Terbaru</h2>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>Informasi resmi dari pemerintah desa.</p>
              </div>
              <Link to="/pengumuman" className="btn">Lihat Semua →</Link>
            </div>
            <div className="grid grid-3">
              {news.map((a) => (
                <Link key={a.id} to={`/pengumuman/${a.id}`} className="card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                  <span className="badge badge-process" style={{ marginBottom: 10 }}>{a.category}</span>
                  <h3 style={{ fontSize: "1.05rem" }}>{a.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {a.content}
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-soft)", marginTop: 8, marginBottom: 0 }}>
                    {new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ background: "var(--primary-50)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Punya Pertanyaan?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            Hubungi kantor desa untuk informasi lebih lanjut.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link to="/tentang" className="btn">Tentang Desa</Link>
            <Link to="/lacak" className="btn btn-primary">Cek Status Permohonan</Link>
          </div>
        </div>
      </section>
    </>
  );
}
