<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\DailyReportController;

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::get('/landing', function () {
    return Inertia::render('Landing');
});

// Knowledge Base Routes (Public / Technical Writer)
Route::get('/knowledge-base', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/knowledge-base/article/{slug}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/app-api/landing/content', [\App\Http\Controllers\LandingContentController::class, 'index']);
Route::get('/app-api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'index']);

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/system-status', function () {
    return Inertia::render('SystemStatus');
})->middleware(['auth', 'verified'])->name('system_status');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tickets (Service Desk)
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('/tickets/create', [TicketController::class, 'create'])->name('tickets.create');
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');

    // Notifications
    Route::post('/notifications/read-all', function () {
        \App\Models\Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);
        return back();
    })->name('notifications.readAll');

    Route::post('/notifications/{notification}/read', function (\App\Models\Notification $notification) {
        if ($notification->user_id === auth()->id()) {
            $notification->update(['is_read' => true]);
        }
        return back();
    })->name('notifications.read');
    
    // Bug Reports
    Route::get('/bugs', [\App\Http\Controllers\BugReportController::class, 'index'])->name('bugs.index');
    Route::post('/bugs', [\App\Http\Controllers\BugReportController::class, 'store'])->name('bugs.store');
    
    // Protect all Admin features
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->group(function () {
        
        // Knowledge Base Admin CRUD
        Route::get('/admin/knowledge-base/create', [ArticleController::class, 'create'])->name('articles.create');
        Route::post('/admin/knowledge-base', [ArticleController::class, 'store'])->name('articles.store');
        Route::get('/admin/knowledge-base/{article}/edit', [ArticleController::class, 'edit'])->name('articles.edit');
        Route::put('/admin/knowledge-base/{article}', [ArticleController::class, 'update'])->name('articles.update');
        Route::delete('/admin/knowledge-base/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');

        // Ticket Admin Update/Delete
        Route::put('/tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
        Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');
        
        Route::put('/bugs/{bug}', [\App\Http\Controllers\BugReportController::class, 'update'])->name('bugs.update');

        Route::get('/analytics', function () { return Inertia::render('Analytics'); })->name('analytics');
        Route::get('/documents', function () { return Inertia::render('Documents'); })->name('documents');
        Route::get('/reports', function () { return Inertia::render('Reports'); })->name('reports');
        Route::get('/team', function () { return Inertia::render('Team'); })->name('team');
        
        Route::get('/admin/landing-manager', function () { return Inertia::render('Admin/LandingManager'); })->name('admin.landing');
        Route::get('/admin/media-manager', function () { return Inertia::render('Admin/MediaManager'); })->name('admin.media');
        Route::get('/admin/settings', function () { return Inertia::render('Admin/Settings'); })->name('admin.settings');
        Route::get('/admin/login-history', [\App\Http\Controllers\AdminLoginHistoryController::class, 'index'])->name('admin.login-history');

        // Laporan Harian Kerja (Replacing SPR)
        Route::get('/daily-reports', [DailyReportController::class, 'index'])->name('daily_reports.index');
        Route::get('/daily-reports/create', [DailyReportController::class, 'create'])->name('daily_reports.create');
        Route::post('/daily-reports', [DailyReportController::class, 'store'])->name('daily_reports.store');
        Route::get('/daily-reports/{dailyReport}', [DailyReportController::class, 'show'])->name('daily_reports.show');
        Route::get('/daily-reports/{dailyReport}/edit', [DailyReportController::class, 'edit'])->name('daily_reports.edit');
        Route::put('/daily-reports/{dailyReport}', [DailyReportController::class, 'update'])->name('daily_reports.update');
        Route::delete('/daily-reports/{dailyReport}', [DailyReportController::class, 'destroy'])->name('daily_reports.destroy');
        Route::get('/daily-reports/{dailyReport}/pdf', [DailyReportController::class, 'downloadPdf'])->name('daily_reports.pdf');

        // API Routes for Pages
        Route::get('/app-api/documents', [\App\Http\Controllers\DocumentController::class, 'index']);
        Route::post('/app-api/documents', [\App\Http\Controllers\DocumentController::class, 'store']);
        Route::delete('/app-api/documents/{id}', [\App\Http\Controllers\DocumentController::class, 'destroy']);
        Route::get('/app-api/reports', [\App\Http\Controllers\ReportController::class, 'index']);
        Route::post('/app-api/reports', [\App\Http\Controllers\ReportController::class, 'store']);
        Route::delete('/app-api/reports/{id}', [\App\Http\Controllers\ReportController::class, 'destroy']);
        
        // Landing Manager API
        Route::put('/app-api/landing/content', [\App\Http\Controllers\LandingContentController::class, 'update']);
        Route::post('/app-api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'store']);
        Route::put('/app-api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'update']);
        Route::delete('/app-api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'destroy']);
        
        Route::get('/app-api/projects', [\App\Http\Controllers\ProjectController::class, 'apiIndex']);
        Route::get('/app-api/projects/{id}/analytics', [\App\Http\Controllers\ProjectController::class, 'analytics']);
        
        // Admin Live Chat
        Route::get('/admin/live-chats', [\App\Http\Controllers\Admin\AdminLiveChatController::class, 'index'])->name('admin.live-chats');
        Route::get('/app-api/admin/live-chats/{session}/messages', [\App\Http\Controllers\Admin\AdminLiveChatController::class, 'getMessages']);
        Route::post('/app-api/admin/live-chats/{session}/send', [\App\Http\Controllers\Admin\AdminLiveChatController::class, 'sendMessage']);
        Route::post('/app-api/admin/live-chats/{session}/close', [\App\Http\Controllers\Admin\AdminLiveChatController::class, 'closeSession']);
    });
});

// Guest Live Chat API
Route::post('/app-api/chat/init', [\App\Http\Controllers\LiveChatController::class, 'init']);
Route::get('/app-api/chat/messages/{sessionId}', [\App\Http\Controllers\LiveChatController::class, 'getMessages']);
Route::post('/app-api/chat/send', [\App\Http\Controllers\LiveChatController::class, 'sendMessage']);

// Temporary route for Vercel production migration
Route::get('/app-api/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        return response()->json([
            'success' => true,
            'message' => 'Migrations and seeders ran successfully!',
            'output' => \Illuminate\Support\Facades\Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::get('/app-api/generate-dummy-notifs', function () {
    $admin = \App\Models\User::where('email', 'admin@fittdesk.com')->first();
    if ($admin) {
        \App\Models\Notification::create([
            'user_id' => $admin->id,
            'title' => 'Tiket Baru Masuk',
            'message' => 'Tiket baru: Masalah Jaringan WiFi (Prioritas: HIGH) dari Budi Santoso.',
            'type' => 'TICKET_CREATED',
            'is_read' => false,
            'created_at' => now()->subMinutes(5)
        ]);
        \App\Models\Notification::create([
            'user_id' => $admin->id,
            'title' => 'Laporan Harian Baru Masuk',
            'message' => 'Laporan Harian baru dari Ahmad Staff untuk project Instalasi Server telah dibuat.',
            'type' => 'REPORT_CREATED',
            'is_read' => false,
            'created_at' => now()->subMinutes(30)
        ]);
        \App\Models\Notification::create([
            'user_id' => $admin->id,
            'title' => 'Update Status Tiket',
            'message' => 'Status tiket "Printer Rusak" telah diubah menjadi RESOLVED.',
            'type' => 'TICKET_UPDATED',
            'is_read' => true,
            'created_at' => now()->subHours(2)
        ]);
        return 'Berhasil membuat 3 notifikasi dummy untuk admin@fittdesk.com!';
    }
    return 'Admin tidak ditemukan.';
});

Route::get('/app-api/debug-notifs', function () {
    $admin = \App\Models\User::where('email', 'admin@fittdesk.com')->first();
    return [
        'admin_id' => $admin ? $admin->id : null,
        'notifications' => $admin ? \App\Models\Notification::where('user_id', $admin->id)->get() : []
    ];
});

Route::get('/app-api/generate-mine', function () {
    $user = auth()->user();
    if (!$user) {
        return 'Please login first. Go to /login';
    }

    \App\Models\Notification::create([
        'user_id' => $user->id,
        'title' => 'Review Monitoring Risiko',
        'message' => "Risiko : Deskripsi Risiko\nUnit Kerja : Sistem Teknologi Informasi\nPengirim : Anita, SE.",
        'type' => 'TICKET_CREATED',
        'is_read' => false,
        'created_at' => now()->subMinutes(2)
    ]);
    \App\Models\Notification::create([
        'user_id' => $user->id,
        'title' => 'Risiko Korporat Completed',
        'message' => "Sasaran Perusahaan: Target Safety Performance\nNama Risiko: 26.CRPR.10\nCatatan: Approve 2 RR corporate",
        'type' => 'REPORT_CREATED',
        'is_read' => true,
        'created_at' => now()->subDays(3)
    ]);
    \App\Models\Notification::create([
        'user_id' => $user->id,
        'title' => 'Risk Register Completed',
        'message' => "Unit Kerja: Sistem Teknologi Informasi (PT Dahana)\nNama Risiko: Test Peristiwa Risiko",
        'type' => 'REPORT_UPDATED',
        'is_read' => false,
        'created_at' => now()->subDays(4)
    ]);
    
    return 'Berhasil! Silakan kembali ke dashboard.';
})->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';


