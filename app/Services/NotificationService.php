<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    public static function sendTicketCreated($ticket)
    {
        // Notify all admins that a new ticket was created
        $admins = User::whereIn('role', ['SUPER_ADMIN', 'ADMIN'])->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Tiket Baru Masuk',
                'message' => "Tiket baru: {$ticket->subject} (Prioritas: {$ticket->priority}) dari {$ticket->user->name}.",
                'type' => 'TICKET_CREATED',
            ]);
        }
    }

    public static function sendTicketUpdated($ticket)
    {
        // Notify the ticket owner that the status/assignee was updated
        Notification::create([
            'user_id' => $ticket->user_id,
            'title' => 'Update Status Tiket',
            'message' => "Status tiket '{$ticket->subject}' telah diubah menjadi {$ticket->status}.",
            'type' => 'TICKET_UPDATED',
        ]);
    }

    public static function sendDailyReportCreated($report)
    {
        // Notify all admins
        $admins = User::whereIn('role', ['SUPER_ADMIN', 'ADMIN'])->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'Laporan Harian Baru Masuk',
                'message' => "Laporan Harian baru dari {$report->user->name} untuk project {$report->project_name} telah dibuat.",
                'type' => 'REPORT_CREATED',
            ]);
        }
    }

    public static function sendDailyReportUpdated($report)
    {
        // Notify the report owner that the status was updated
        Notification::create([
            'user_id' => $report->user_id,
            'title' => 'Update Status Laporan Harian',
            'message' => "Status Laporan Harian untuk project {$report->project_name} telah diubah menjadi {$report->status}.",
            'type' => 'REPORT_UPDATED',
        ]);
    }
}
