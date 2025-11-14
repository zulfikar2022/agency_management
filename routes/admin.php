<?php

use App\Http\Controllers\AdminController\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::group(['middleware' => ['auth','adminonly']], function () {
    
// admin dashboard route
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');


// create product route (render page)
Route::get('/admin/create-product', [ProductController::class, 'createProduct'])->name('admin.createProduct');
// store product route
Route::post('/admin/store-product', [ProductController::class, 'storeProduct'])->name('admin.storeProduct');


// show all products route
Route::get('/admin/products', [ProductController::class, 'showProducts'])->name('admin.showProducts');




// show available products route
Route::get('/admin/products/available', [ProductController::class, 'showAvailableProducts'])->name('admin.showAvailableProducts');



// show unavailable products route
Route::get('/admin/products/unavailable', [ProductController::class, 'showUnavailableProducts'])->name('admin.showUnavailableProducts');

// show all customers route
Route::get('/admin/customers', [CustomerController::class, 'index'])->name('admin.showCustomers');
// add customer route (render page)
Route::get('/admin/create-customer', [CustomerController::class, 'create'])->name('admin.createCustomer');

 


//================== DYNAMIC ROUTES =================   
// show product by id route
Route::get('/admin/products/{id}', [ProductController::class, 'showProductById'])->name('admin.showProductById');

Route::get('/admin/products/update/{id}', [ProductController::class, 'showUpdateProductPage'])->name('admin.showUpdateProductPage');

Route::put('/admin/products/update/{id}', [ProductController::class, 'updateProduct'])->name('admin.updateProduct');

Route::get('/admin/products/toggle-availability/{id}', [ProductController::class, 'toggleProductStatus'])->name('admin.toggleProductStatus');




});