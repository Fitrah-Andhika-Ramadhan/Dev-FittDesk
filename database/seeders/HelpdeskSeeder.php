<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Ticket;
use App\Models\User;

class HelpdeskSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@fittdesk.com')->first();
        if (!$admin) {
            $admin = User::first();
        }

        // Create Dummy Articles (Knowledge Base)
        $articles = [
            [
                'title' => 'Panduan Reset Password Akun Email Perusahaan',
                'category' => 'Troubleshooting',
                'content' => 'Jika Anda lupa password email perusahaan, ikuti langkah berikut: <br><br>1. Buka portal login email.<br>2. Klik tombol "Lupa Password".<br>3. Masukkan NIK dan nomor handphone yang terdaftar.<br>4. Masukkan kode OTP yang dikirim melalui WhatsApp.<br>5. Buat password baru yang terdiri dari minimal 8 karakter dengan kombinasi angka dan huruf.<br><br>Jika Anda tidak menerima OTP, harap hubungi Service Desk.',
                'status' => 'PUBLISHED',
                'author_id' => $admin->id,
            ],
            [
                'title' => 'Instalasi dan Konfigurasi VPN Kantor',
                'category' => 'Tutorials',
                'content' => 'Untuk dapat mengakses server internal dari luar jaringan kantor, Anda memerlukan koneksi VPN. Berikut langkah-langkahnya:<br><br>1. Unduh aplikasi OpenVPN Client dari intranet.<br>2. Minta file konfigurasi (.ovpn) kepada tim IT.<br>3. Buka aplikasi OpenVPN, lalu Import file konfigurasi tersebut.<br>4. Masukkan username dan password aktif (sama seperti login PC).<br>5. Klik Connect. Apabila status sudah hijau, artinya VPN telah aktif dan Anda bisa mengakses sistem internal.',
                'status' => 'PUBLISHED',
                'author_id' => $admin->id,
            ],
            [
                'title' => 'Dokumentasi REST API FittDesk V1',
                'category' => 'API Documentation',
                'content' => 'FittDesk menyediakan REST API untuk integrasi sistem eksternal.<br><br><b>Endpoint Utama:</b> `https://api.fittdesk.com/v1`<br><br><b>Autentikasi:</b> Gunakan Bearer Token yang didapatkan dari halaman pengaturan profil.<br><br><b>Contoh Request:</b><br>`GET /tickets`<br>Header: `Authorization: Bearer {token}`<br><br><b>Response:</b><br>Berisi daftar tiket berformat JSON beserta status dan prioritasnya.',
                'status' => 'PUBLISHED',
                'author_id' => $admin->id,
            ],
            [
                'title' => 'Cara Mengajukan Cuti melalui HRIS (Draft)',
                'category' => 'General',
                'content' => 'Sistem pengajuan cuti kini telah terintegrasi dengan portal HRIS baru. Panduan ini masih dalam tahap penulisan dan belum lengkap.',
                'status' => 'DRAFT',
                'author_id' => $admin->id,
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }

        // Create Dummy Tickets
        $tickets = [
            [
                'subject' => 'Printer di Lantai 3 Tidak Bisa Mencetak',
                'description' => 'Printer HP LaserJet di dekat ruangan HRD tidak merespon saat mencoba mencetak dokumen. Lampu indikator error berkedip merah. Tolong segera dicek karena ada dokumen penting yang harus diprint.',
                'priority' => 'MEDIUM',
                'status' => 'OPEN',
                'user_id' => $admin->id,
                'assigned_to' => null,
            ],
            [
                'subject' => 'Sistem ERP Sangat Lambat',
                'description' => 'Sejak pagi tadi akses ke sistem ERP (modul Finance) sangat lambat saat membuka laporan bulanan. Proses loading membutuhkan waktu lebih dari 5 menit untuk 1 laporan.',
                'priority' => 'HIGH',
                'status' => 'IN_PROGRESS',
                'user_id' => $admin->id,
                'assigned_to' => $admin->id,
            ],
            [
                'subject' => 'Lupa Password Akun Zoom Premium',
                'description' => 'Saya butuh mengadakan meeting dengan klien siang ini, tetapi lupa password akun Zoom Premium departemen Marketing. Mohon bantuannya untuk mereset password secepatnya.',
                'priority' => 'HIGH',
                'status' => 'RESOLVED',
                'user_id' => $admin->id,
                'assigned_to' => $admin->id,
            ],
            [
                'subject' => 'Server Website Utama DOWN',
                'description' => 'Website profil perusahaan tidak dapat diakses (Error 502 Bad Gateway). Terpantau dari seluruh koneksi eksternal. Mohon segera ditangani!',
                'priority' => 'CRITICAL',
                'status' => 'OPEN',
                'user_id' => $admin->id,
                'assigned_to' => null,
            ],
            [
                'subject' => 'Request Akses Lisensi Adobe Illustrator',
                'description' => 'Tim desain grafis ada penambahan staf baru. Mohon bantuan untuk mendaftarkan email staf baru tersebut ke lisensi Adobe Creative Cloud perusahaan.',
                'priority' => 'LOW',
                'status' => 'CLOSED',
                'user_id' => $admin->id,
                'assigned_to' => $admin->id,
            ],
        ];

        foreach ($tickets as $ticket) {
            Ticket::create($ticket);
        }
    }
}
