# Functional Specification Document (FSD)
## FittDesk: IT Helpdesk & Service Center

### 1. Modul Service Desk (Ticketing)
Modul ini digunakan untuk melacak pelaporan isu, permintaan layanan, atau insiden keamanan.
- **Create Ticket**: User memasukkan detail Subjek, Deskripsi, dan Prioritas (Low, Medium, High, Critical).
- **Ticket Tracking**: Status tiket akan diubah oleh Admin mulai dari OPEN, IN PROGRESS, RESOLVED, dan CLOSED.
- **Ticket Assignment**: Admin dapat melakukan delegasi tiket (Assign To) ke agen IT tertentu.

### 2. Modul Knowledge Base
Modul yang bertindak sebagai basis pengetahuan teknis.
- **Read Article**: Publik/user dapat membaca artikel panduan penyelesaian masalah.
- **Manage Article (Admin Only)**: Admin dapat menambahkan artikel menggunakan Markdown, mengkategorikannya, serta mengubah status publikasi antara DRAFT dan PUBLISHED.

### 3. Modul Log Harian (Daily Reports)
Modul untuk pelaporan produktivitas / catatan shift IT harian.
- **Create Log**: Agen / user membuat log mencatat *Shift/Kondisi*, *Total Tiket Ditangani*, *Ringkasan Penanganan*, *Isu Eskalasi*, serta *Aset Terkait*. 
- **Approval Flow**: Status laporan diajukan secara DRAFT, lalu disubmit (SUBMITTED) kepada atasan untuk disetujui (APPROVED).
- **Export to PDF**: Laporan harian bisa didownload dalam format dokumen PDF.

### 4. Modul Dokumen IT & Laporan SLA (Documents & Reports)
Modul berkas pendukung manajemen IT.
- **Documents Manager**: Tempat pengunggahan berkas standar (SOP, IT Policy, License/Certificate, Architecture Diagram).
- **SLA Reports**: Form *generator* yang mencatat rangkuman SLA Performance bulanan, Uptime Report, Security Audit, yang disimpan pada database dan dapat diklasifikasikan statusnya.

### 5. Analytics Dashboard & System Status
Modul visualisasi.
- **Analytics Dashboard**: Menampilkan grafik *recharts* (React) performa SLA (SLA Compliance Ratio, Average Resolution Time, Ticket Volume).
- **System Status**: Halaman *monitoring uptime* secara simulatif yang dapat diubah pesan pengumumannya melalui backend.

### 6. Media & Landing Manager
- **Media Manager**: Manajemen asset gambar/video (CRUD) menggunakan pop-up validasi SweetAlert.
- **Landing Content**: Pengelolaan teks halaman depan aplikasi (Hero title, visi, misi, deskripsi) secara statis tanpa harus masuk ke kode sumber.
