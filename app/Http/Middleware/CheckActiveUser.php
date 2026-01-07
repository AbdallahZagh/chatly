<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User|null $user */
        $user = \Illuminate\Support\Facades\Auth::user();

        if ($user && $user->isDeactivated()) {
            return response()->json([
                'error' => 'Account Deactivated',
                'description' => 'Your account has been deactivated. Please reactivate your account to continue.'
            ], 403);
        }

        return $next($request);
    }
}
