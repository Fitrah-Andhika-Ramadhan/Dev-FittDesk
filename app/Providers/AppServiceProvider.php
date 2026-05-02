<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use App\Models\LoginHistory;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Event::listen(function (Login $event) {
            LoginHistory::create([
                'user_id' => $event->user->id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'login_at' => now(),
            ]);
        });
    }
}
