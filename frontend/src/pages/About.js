export default function About() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-title">
          <div>
            <h1>Tentang Desa</h1>
            <div className="subtitle">Profil singkat dan struktur pemerintahan desa.</div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Profil Desa</h3>
            <p>
              Desa kami merupakan desa yang berkomitmen memberikan pelayanan
              administrasi terbaik bagi seluruh warga. Dengan hadirnya sistem
              <b> e-Desa Service</b>, kami berharap pelayanan menjadi lebih cepat,
              transparan, dan dapat diakses kapan saja.
            </p>
            <h3 style={{ marginTop: 20 }}>Visi</h3>
            <p>Mewujudkan desa yang maju, mandiri, dan sejahtera melalui pelayanan publik berbasis digital.</p>
            <h3 style={{ marginTop: 20 }}>Misi</h3>
            <ul style={{ paddingLeft: 20, color: "var(--text-muted)" }}>
              <li>Meningkatkan kualitas pelayanan administrasi desa.</li>
              <li>Mempermudah akses warga terhadap layanan pemerintahan.</li>
              <li>Mendorong transparansi dan akuntabilitas dalam pelayanan.</li>
              <li>Mendukung digitalisasi tata kelola desa.</li>
            </ul>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>Kontak Kantor Desa</h3>
              <p style={{ marginBottom: 6 }}><b>📍 Alamat</b></p>
              <p style={{ color: "var(--text-muted)" }}>Jl. Raya Desa No. 1, Kantor Kepala Desa</p>

              <p style={{ marginBottom: 6, marginTop: 14 }}><b>📞 Telepon</b></p>
              <p style={{ color: "var(--text-muted)" }}>(021) 1234-5678</p>

              <p style={{ marginBottom: 6, marginTop: 14 }}><b>✉️ Email</b></p>
              <p style={{ color: "var(--text-muted)" }}>info@edesa.id</p>

              <p style={{ marginBottom: 6, marginTop: 14 }}><b>🕐 Jam Pelayanan</b></p>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                Senin – Jumat: 08:00 – 16:00<br />
                Sabtu: 08:00 – 12:00<br />
                Minggu & Libur: TUTUP
              </p>
            </div>

            <div className="card">
              <h3>Pelayanan Online 24 Jam</h3>
              <p style={{ color: "var(--text-muted)" }}>
                Pengajuan surat dan tracking dapat dilakukan kapan saja melalui
                website ini. Permohonan akan diverifikasi pada jam kerja.
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>Struktur Pemerintahan Desa</h3>
          <div className="grid grid-3">
            <div style={{ textAlign: "center", padding: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-50)", margin: "0 auto 10px", display: "grid", placeItems: "center", fontSize: "1.6rem" }}>👤</div>
              <b>Kepala Desa</b>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>Pemimpin tertinggi desa</p>
            </div>
            <div style={{ textAlign: "center", padding: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-50)", margin: "0 auto 10px", display: "grid", placeItems: "center", fontSize: "1.6rem" }}>📋</div>
              <b>Sekretaris Desa</b>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>Administrasi & tata usaha</p>
            </div>
            <div style={{ textAlign: "center", padding: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-50)", margin: "0 auto 10px", display: "grid", placeItems: "center", fontSize: "1.6rem" }}>🏛️</div>
              <b>Kaur & Kasi</b>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>Pelaksana pelayanan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
