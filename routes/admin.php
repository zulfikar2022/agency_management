<?php

use App\Http\Controllers\AdminController\AdminController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::group(['middleware' => ['auth','adminonly']], function () {
    
// admin dashboard route
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');


// create product route
Route::get('/admin/create-product', [AdminController::class, 'createProduct'])->name('admin.createProduct');


// show all products route
Route::get('/admin/products', [AdminController::class, 'showProducts'])->name('admin.showProducts');




// show available products route
Route::get('/admin/products/available', [AdminController::class, 'showAvailableProducts'])->name('admin.showAvailableProducts');



// show unavailable products route
Route::get('/admin/products/unavailable', [AdminController::class, 'showUnavailableProducts'])->name('admin.showUnavailableProducts');


// show product by id route
Route::get('/admin/products/{id}', [AdminController::class, 'showProductById'])->name('admin.showProductById');


});