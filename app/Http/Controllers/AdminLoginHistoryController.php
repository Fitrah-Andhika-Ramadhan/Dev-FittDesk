<?php

namespace App\Http\Controllers;

use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLoginHistoryController extends Controller
{
    public function index()
    {
        $histories = LoginHistory::with('user')
            ->orderBy('login_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/LoginHistory', [
            'histories' => $histories
        ]);
    }
}
