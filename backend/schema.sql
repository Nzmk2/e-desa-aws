-- =====================================================
-- e-Desa Service Database Schema
-- =====================================================
-- Run this on your RDS MySQL instance
-- mysql -h <RDS_ENDPOINT> -u admin -p edesa < schema.sql

CREATE DATABASE IF NOT EXISTS edesa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edesa;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nik VARCHAR(20),
  phone VARCHAR(20),
  address TEXT,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- ---------- REQUESTS ----------
CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  purpose TEXT,
  status ENUM('Diajukan','Diproses','Disetujui','Ditolak','Selesai')
         NOT NULL DEFAULT 'Diajukan',
  document_key VARCHAR(500),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  CONSTRAINT fk_requests_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- STATUS HISTORY (timeline) ----------
CREATE TABLE IF NOT EXISTS status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  status VARCHAR(30) NOT NULL,
  notes TEXT,
  changed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_request (request_id),
  CONSTRAINT fk_history_request
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_history_user
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- ANNOUNCEMENTS ----------
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'Umum',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ann_user
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- DEFAULT ADMIN ----------
-- Email   : admin@edesa.id
-- Password: admin123  (CHANGE AFTER FIRST LOGIN!)
-- Hash di bawah sudah di-bcrypt untuk "admin123" (cost=10)
INSERT INTO users (name, email, password, role)
VALUES (
  'Administrator Desa',
  'admin@edesa.id',
  '$2b$10$VhO7RwbJ8FXPVPVb0JBo1.uMtRzutG7pYNkIUk005ym9T3e2u76Hu',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;

-- ---------- SAMPLE ANNOUNCEMENTS ----------
INSERT INTO announcements (title, content, category, created_by) VALUES
('Selamat Datang di e-Desa Service',
 'Sistem layanan online resmi desa kini tersedia. Anda dapat mengajukan surat-menyurat secara online tanpa harus datang ke kantor desa. Dokumen Anda akan diproses dalam 1-3 hari kerja.',
 'Informasi', 1),
('Jam Pelayanan Kantor Desa',
 'Senin - Jumat: 08:00 - 16:00 WIB. Sabtu: 08:00 - 12:00 WIB. Minggu & hari libur: TUTUP. Untuk pelayanan online tersedia 24 jam melalui website ini.',
 'Pengumuman', 1),
('Persyaratan Pengajuan Surat',
 'Setiap pengajuan surat wajib melampirkan scan/foto KTP yang masih berlaku. Untuk surat tertentu mungkin diperlukan KK. Pastikan dokumen jelas dan terbaca.',
 'Petunjuk', 1)
ON DUPLICATE KEY UPDATE title = title;
