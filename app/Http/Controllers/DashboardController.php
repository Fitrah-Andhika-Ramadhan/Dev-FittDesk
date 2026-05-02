<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;
use App\Models\Article;
use App\Models\DailyReport;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $ticketsCount = Ticket::where('user_id', $user->id)->count();
        $articlesCount = Article::count();
        $reportsCount = DailyReport::where('user_id', $user->id)->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'tickets' => $ticketsCount,
                'articles' => $articlesCount,
                'reports' => $reportsCount
            ]
        ]);
    }
}
