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
                'message' => "Subjek : {$ticket->subject}\nPrioritas : {$ticket->priority}\nPengirim : {$ticket->user->name}",
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
            'message' => "Subjek : {$ticket->subject}\nStatus Baru : {$ticket->status}\nSistem : IT Helpdesk",
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
                'title' => 'Laporan Harian Baru',
                'message' => "Proyek : {$report->project_name}\nJumlah Pekerja : {$report->workers_count} Orang\nPengirim : {$report->user->name}",
                'type' => 'REPORT_CREATED',
            ]);
        }
    }

    public static function sendDailyReportUpdated($report)
    {
        // Notify the report owner that the status was updated
        Notification::create([
            'user_id' => $report->user_id,
            'title' => 'Update Laporan Harian',
            'message' => "Proyek : {$report->project_name}\nStatus Baru : {$report->status}\nSistem : Project Management",
            'type' => 'REPORT_UPDATED',
        ]);
    }
}
