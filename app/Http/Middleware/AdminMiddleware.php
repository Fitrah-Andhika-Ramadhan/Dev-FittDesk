<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!in_array($request->user()->role, ['SUPER_ADMIN', 'ADMIN'])) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak. Fitur ini hanya untuk admin.');
        }

        return $next($request);
    }
}
