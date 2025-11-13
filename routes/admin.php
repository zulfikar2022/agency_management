<?php

use App\Http\Controllers\AdminController\AdminController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// admin dashboard route
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware(['auth'])->name('admin.dashboard');


// create product route
Route::get('/admin/create-product', [AdminController::class, 'createProduct'])->middleware(['auth'])->name('admin.createProduct');


// show all products route
Route::get('/admin/products', [AdminController::class, 'showProducts'])->middleware(['auth'])->name('admin.showProducts');


// show product by id route
Route::get('/admin/products/{id}', [AdminController::class, 'showProductById'])->middleware(['auth'])->name('admin.showProductById');

// show available products route
Route::get('/admin/products/available', [AdminController::class, 'showAvailableProducts'])->middleware(['auth'])->name('admin.showAvailableProducts');

// show unavailable products route
Route::get('/admin/products/unavailable', [AdminController::class, 'showUnavailableProducts'])->middleware(['auth'])->name('admin.showUnavailableProducts');

