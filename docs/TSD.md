# Technical Specification Document (TSD)
## FittDesk: IT Helpdesk & Service Center

### 1. Stack Teknologi (Technology Stack)
Aplikasi ini dikembangkan di atas ekosistem modern menggunakan stack berikut:
- **Backend Framework**: Laravel 11 (PHP 8.2+)
- **Frontend Framework**: React.js (versi 18+) dengan TypeScript
- **Bridging / Data Fetching**: Inertia.js (berfungsi sebagai konektor SPA antara Laravel dan React)
- **Styling**: TailwindCSS, Shadcn UI components (Radix UI)
- **Database**: SQLite (default / environment local) atau MySQL / PostgreSQL
- **Pustaka Tambahan**:
  - `sweetalert2` untuk pop-up validasi.
  - `recharts` untuk visualisasi chart analitik.
  - `lucide-react` untuk iconography modern.

### 2. Arsitektur Keamanan (Security Architecture)
Sistem ini menggunakan arsitektur keamanan standar industri modern:
- **Sanctum Authentication**: Manajemen *cookie-based session* dan API Token untuk SPA.
- **CSRF Protection**: Laravel dan Inertia.js menggunakan token XSRF secara otomatis untuk mencegah serangan pemalsuan permintaan antar situs.
- **SQL Injection Prevention**: Seluruh kueri basis data dieksekusi menggunakan Eloquent ORM atau *Parameterized Queries* di Query Builder, mengeliminasi celah *SQL injection*. Tidak ada *Raw Queries* yang menyuntikkan variabel mentah secara sewenang-wenang.
- **Mass Assignment Protection**: Dilakukan melalui definisi `$fillable` secara ketat pada model Eloquent.
- **XSS Prevention**: React mendisinfeksi (*escape*) *string interpolations* secara bawaan.

### 3. Struktur Database Utama (Database Schema Core)
1. `users` : Data autentikasi dan otorisasi. Atribut `role` menyimpan tipe peranan (SUPER_ADMIN, ADMIN, USER).
2. `tickets` : Model relasional menyimpan subjek, prioritas, status pelaporan bug/bantuan teknis, *reporter*, dan *assignee*.
3. `articles` : Model penyimpanan *Knowledge Base*, memiliki *slug* unik dan status *published/draft*.
4. `daily_reports` : Menyimpan entri *timesheet* / laporan shift IT (termasuk total insiden, isu lapangan, foto dokumentasi lokal).
5. `documents` & `reports` : Model yang menangani upload SLA dan *IT Policy / SOP*.
6. `landing_contents` & `landing_media` : Model dinamis berbasis *key-value* dan media (image/video) untuk konten *landing page*.

### 4. Struktur API (API Design)
Aplikasi sangat mengandalkan *Controller* yang merespon render dari `Inertia::render()`. Sebagian besar modul menggunakan skema *Resource Controller* standar (Index, Create, Store, Show, Edit, Update, Destroy). 
Sementara itu, beberapa integrasi *Dashboard Analytics* memanggil *endpoint API* khusus:
- `GET /api/reports` : Mengambil JSON data tipe laporan.
- `GET /api/documents` : Mengambil JSON list dokumen IT.
- `GET /api/landing/media` : Rest API statis konsumsi tabel media di halaman depan.
