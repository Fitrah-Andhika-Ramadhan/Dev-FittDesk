# FittDesk Manual Book (Buku Panduan)

Selamat datang di sistem dokumentasi panduan penggunaan FittDesk, sebuah platform Helpdesk & IT Service Center mutakhir.

## Bagian 1: Panduan Pengguna Biasa (User / Karyawan Umum)

### 1.1 Login & Autentikasi
1. Akses alamat web FittDesk di browser Anda.
2. Klik tombol **Login** di sudut kanan atas.
3. Masukkan Email dan Password. Jika belum memiliki akun, klik **Register** untuk mendaftar akun karyawan baru.

### 1.2 Melaporkan Isu atau Masalah Teknis (Membuat Tiket)
1. Setelah Login, masuk ke Menu **Service Desk / Tickets**.
2. Klik tombol warna biru **Ajukan Tiket**.
3. Isi **Subjek** (Misal: *Komputer tidak bisa nyala*).
4. Tuliskan detail masalah pada **Deskripsi** dengan rinci.
5. Pilih **Prioritas** (Low, Medium, High, Critical).
6. Klik **Simpan** dan tunggu Agen IT menugaskan dan menyelesaikan masalah Anda. Anda dapat melihat perkembangan statusnya di halaman yang sama.

### 1.3 Mengakses Knowledge Base (Artikel Bantuan)
1. Pergi ke menu **Knowledge Base**.
2. Anda akan melihat banyak artikel tata cara penyelesaian masalah (*Troubleshooting*).
3. Anda dapat mencari kata kunci masalah di kolom pencarian.
4. Klik pada artikel untuk membacanya.

---

## Bagian 2: Panduan Agen IT / Staff Operasional

### 2.1 Mengisi Laporan Harian (Log Shift)
Bagi Agen IT yang ditugaskan dalam shift harian, Anda diwajibkan menulis laporan produktivitas:
1. Masuk ke **Dashboard** atau klik menu **Daily Reports**.
2. Klik tombol **Buat Laporan Baru**.
3. Pilih area atau Departemen yang ditangani, dan isi Kondisi/Shift.
4. Tulis total tiket yang diselesaikan, lalu rincikan tindakan penyelesaiannya.
5. Apabila ada *Hardware / Aset* yang diganti, harap dimasukkan pada kolom Aset.
6. Unggah foto bukti (jika ada), dan submit laporan Anda.

### 2.2 Men-download Dokumen Kebijakan IT
1. Kunjungi menu **Dokumen IT**.
2. Download file-file terkait seperti SOP, Standard License, dan Architecture System yang dibutuhkan.

---

## Bagian 3: Panduan Administrator / Manajer IT

### 3.1 Manajemen Tiket Pengguna
1. Buka menu **Service Desk**. Admin akan melihat tiket dari **semua pengguna** (berbeda dengan User yang hanya melihat tiket miliknya sendiri).
2. Klik **Lihat (Icon Dokumen)** pada salah satu tiket berstatus *OPEN*.
3. Ubah statusnya menjadi *IN PROGRESS* dan di kolom sebelah kanannya, delegasikan ke agen (Assign To).
4. Klik **Update**.

### 3.2 Menambah Artikel Knowledge Base
1. Buka menu **Knowledge Base**.
2. Klik **Tambah Artikel**.
3. Judul artikel dan isinya dapat diedit menggunakan pemformatan dasar (menggunakan enter dan bullet text). 
4. Pilih kategori yang tepat (Network, Software, dll) lalu klik Publikasikan.

### 3.3 Analytics & Settings (Konfigurasi Aplikasi)
1. Admin Dashboard (*Analytics*) menyediakan chart performa yang dapat dipantau terkait pemenuhan SLA dan kecepatan merespons.
2. Di halaman **Settings**, Admin dapat mengatur parameter seperti ambang batas waktu penyelesaian SLA (Misal: peringatan SLA bila lebih dari 48 jam).

### 3.4 Media Manager & Konten Landing Page
1. Kunjungi **Landing Media Manager** pada sidebar Admin.
2. Halaman ini mengatur gambar, slideshow, atau profil perusahaan yang muncul di halaman awal sebelum *login*.
3. Klik tombol sampah untuk menghapus, di mana sistem validasi interaktif *SweetAlert2* akan memastikan kehati-hatian tindakan Anda.
