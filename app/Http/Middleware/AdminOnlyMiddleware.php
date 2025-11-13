<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AdminOnlyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
      
        $user = Auth::guard('web')->user();
        
        
        if($user && $user['is_activated'] && $user['is_admin'] && !$user['is_deleted']) {
            $leanUser = User::getLeanUser($user->email);
            $request->attributes->set('user', $leanUser);
            return $next($request);
        } else {
            return redirect()->route('home');
        }
        
    }
}
