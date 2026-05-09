<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = \App\Models\User::all();
foreach($users as $user) {
    \App\Models\Notification::create([
        'user_id' => $user->id,
        'title' => 'Tiket Baru Masuk',
        'message' => 'Tiket baru: Masalah Jaringan WiFi (Prioritas: HIGH) dari Budi Santoso.',
        'type' => 'TICKET_CREATED',
        'is_read' => false,
        'created_at' => now()->subMinutes(5)
    ]);
    \App\Models\Notification::create([
        'user_id' => $user->id,
        'title' => 'System Update',
        'message' => 'Sistem telah diupdate ke versi terbaru.',
        'type' => 'SYSTEM_UPDATE',
        'is_read' => true,
        'created_at' => now()->subHours(2)
    ]);
}
echo "Done\n";
