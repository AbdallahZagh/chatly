<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class UpdateUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            /** @var \App\Models\User $user */
            
            // 1. Instant Status (Cache) - Expires in 10 seconds
            // This is super fast and runs on every request
            \Illuminate\Support\Facades\Cache::put('user-is-online-' . $user->id, true, now()->addSeconds(10));

            // 2. Historical Data (DB) - Throttled
            // Only update DB if last update was more than 1 minute ago
            if (!$user->last_seen_at || $user->last_seen_at->lt(now()->subMinute())) {
                $user->last_seen_at = now();
                $user->save();
            }
        }

        return $next($request);
    }
}
