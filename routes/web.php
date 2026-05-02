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

Route::get('/api/landing/content', [\App\Http\Controllers\LandingContentController::class, 'index']);
Route::get('/api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'index']);

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
        Route::get('/api/documents', [\App\Http\Controllers\DocumentController::class, 'index']);
        Route::post('/api/documents', [\App\Http\Controllers\DocumentController::class, 'store']);
        Route::delete('/api/documents/{id}', [\App\Http\Controllers\DocumentController::class, 'destroy']);
        Route::get('/api/reports', [\App\Http\Controllers\ReportController::class, 'index']);
        Route::post('/api/reports', [\App\Http\Controllers\ReportController::class, 'store']);
        Route::delete('/api/reports/{id}', [\App\Http\Controllers\ReportController::class, 'destroy']);
        
        // Landing Manager API
        Route::put('/api/landing/content', [\App\Http\Controllers\LandingContentController::class, 'update']);
        Route::post('/api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'store']);
        Route::put('/api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'update']);
        Route::delete('/api/landing/media', [\App\Http\Controllers\LandingMediaController::class, 'destroy']);
        
        Route::get('/api/projects', [\App\Http\Controllers\ProjectController::class, 'apiIndex']);
        Route::get('/api/projects/{id}/analytics', [\App\Http\Controllers\ProjectController::class, 'analytics']);
    });
});

require __DIR__.'/auth.php';
