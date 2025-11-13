<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
{
    $request->authenticate();
    $request->session()->regenerate();

    $user = User::where('email', $request->email)->first();

    
    if ($user?->is_employee && $user->is_activated && !$user->is_deleted) {
        
        return redirect()->intended(route('employee.dashboard', absolute: false));
    }

    if ($user?->is_admin && $user->is_activated && !$user->is_deleted) {
        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    // Invalid role or inactive/deleted → log out + error
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login')->withErrors([
        'email' => 'Your account does not have access or is inactive/deleted.',
    ]);
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
