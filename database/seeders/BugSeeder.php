<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BugReport;
use App\Models\User;

class BugSeeder extends Seeder
{
    public function run(): void
    {
        $u = User::first();
        if (!$u) return;

        BugReport::create([
            'title' => 'Menu login tidak responsif di Safari', 
            'description' => 'Ketika mencoba login menggunakan browser Safari versi lama, tombol login tidak bisa diklik.', 
            'severity' => 'LOW', 
            'status' => 'OPEN', 
            'reported_by' => $u->id
        ]);

        BugReport::create([
            'title' => 'Error 500 saat upload lampiran PDF', 
            'description' => 'Sistem mengembalikan error 500 Internal Server Error saat mengunggah file laporan PDF di atas 10MB.', 
            'severity' => 'HIGH', 
            'status' => 'INVESTIGATING', 
            'reported_by' => $u->id, 
            'assigned_to' => $u->id
        ]);

        BugReport::create([
            'title' => 'Data profil ganda', 
            'description' => 'Ada duplikasi data profil di beberapa pengguna saat sistem melakukan sinkronisasi dengan server HRIS.', 
            'severity' => 'CRITICAL', 
            'status' => 'FIXED', 
            'resolution_notes' => 'Telah ditambahkan unique constraint pada migrasi dan script pembersihan data duplikat sudah dijalankan.', 
            'reported_by' => $u->id, 
            'assigned_to' => $u->id
        ]);
    }
}
