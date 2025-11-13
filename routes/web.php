<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    $user = Auth::guard('web')->user();

    if ($user) {
        if ($user?->is_employee && $user->is_activated && !$user->is_deleted) {
            return redirect()->intended(route('employee.dashboard', absolute: false));
        }

        if ($user?->is_admin && $user->is_activated && !$user->is_deleted) {

            return redirect()->intended(route('admin.dashboard', absolute: false));
        }
    }

    return redirect()->route('login')->withErrors([
        'email' => 'Your account does not have access or is inactive/deleted.',
    ]);
})->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

Route::get('/fake-user', function () {
    return Inertia::render('FakeUser');
})->name('fake-user');

require __DIR__.'/auth.php';
require __DIR__.'/employee.php';
require __DIR__.'/admin.php';
