<?php

namespace App\Services;

use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public static function sendSprUpdate($user, $spr, $status)
    {
        $messages = [
            'APPROVED' => "Selamat! Pengajuan SPR Anda untuk unit {$spr->unit_block}/{$spr->unit_number} telah DISETUJUI. Silakan login ke sistem untuk mengunggah bukti pembayaran DP/Booking Fee.",
            'REJECTED' => "Mohon maaf, pengajuan SPR Anda untuk unit {$spr->unit_block}/{$spr->unit_number} belum dapat kami setujui. Terima kasih atas ketertarikan Anda.",
            'WAITING_PAYMENT' => "Terima kasih. Bukti pembayaran Booking Fee Anda telah kami terima dan sedang dalam proses verifikasi.",
            'BOOKING_CONFIRMED' => "Selamat! Pembayaran Anda telah dikonfirmasi. Unit {$spr->unit_block}/{$spr->unit_number} resmi kami kunci untuk Anda (Status: SOLD)."
        ];

        if (!isset($messages[$status])) {
            return;
        }

        $message = $messages[$status];

        // 1. Simpan ke Database (Notifikasi In-App)
        if ($user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Update Status SPR',
                'message' => $message,
                'type' => 'SPR_UPDATE',
            ]);
        }

        // 2. Mocking Pengiriman WhatsApp & Email via Log
        Log::info("====================================");
        Log::info("🔔 WHATSAPP BROADCAST MOCKUP");
        Log::info("To: " . $spr->buyer_contact);
        Log::info("Message: " . $message);
        Log::info("------------------------------------");
        Log::info("✉️ EMAIL SENT MOCKUP");
        Log::info("To: " . $spr->buyer_email);
        Log::info("Subject: Update Status SPR Nata Group");
        Log::info("Body: " . $message);
        Log::info("====================================");
    }
}
