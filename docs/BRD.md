# Business Requirements Document (BRD)
## FittDesk: IT Helpdesk & Service Center

### 1. Ringkasan Eksekutif (Executive Summary)
FittDesk adalah sistem manajemen layanan IT (ITSM) terpadu yang bertujuan untuk menstandarisasi proses penerimaan keluhan, pelacakan tiket (ticketing), manajemen aset pengetahuan (knowledge base), serta pemantauan SLA (Service Level Agreement) tim operasional IT. Proyek ini merupakan transformasi dari sistem proyek konstruksi legacy (Nata Group) menjadi platform Service Desk modern.

### 2. Tujuan Bisnis (Business Objectives)
- Mempercepat proses pelaporan dan resolusi masalah teknis pengguna (Mean Time to Resolve/MTTR).
- Mendokumentasikan solusi masalah secara terpusat melalui fitur Knowledge Base untuk mengurangi tiket berulang.
- Mengontrol SLA secara otomatis dan menyajikan dashboard analitik yang transparan bagi pimpinan operasional.
- Menyediakan platform pelaporan log kerja harian/shift secara terstruktur bagi para agen IT.

### 3. Ruang Lingkup (Scope)
Sistem ini meliputi komponen-komponen utama berikut:
1. **Service Desk (Ticket Management)**: Pengajuan, penugasan, dan pembaruan status tiket.
2. **Knowledge Base**: Direktori artikel pemecahan masalah dan dokumentasi prosedur.
3. **Daily Log**: Sistem absensi / laporan penanganan tiket secara harian untuk tiap shift.
4. **Analytics & Reports**: Visualisasi dan konversi data ke format PDF terkait performa layanan.
5. **Settings & Media Management**: Panel konfigurasi admin untuk aset grafis aplikasi.

### 4. Pengguna & Hak Akses (User Roles)
1. **SUPER_ADMIN / ADMIN**: Memiliki kendali penuh pada sistem. Dapat mengubah status tiket, mendelegasikan tiket, menambah artikel Knowledge Base, menghapus data, dan mengonfigurasi pengaturan sistem.
2. **USER / AGENT**: Dapat membuat tiket pengaduan, melihat status tiket miliknya, menyusun laporan kerja harian, dan membaca materi Knowledge Base.
