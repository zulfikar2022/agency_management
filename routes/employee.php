<?php

use App\Http\Controllers\EmployeeController\EmployeeController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// employee dashboard route
Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->middleware(['auth'])->name('employee.dashboard');