<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\SuperAdminController\SuperAdminController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','superadminonly']], function () {
    // Super Admin dashboard route
    Route::get('/super-admin/all-users', [SuperAdminController::class, 'allUsers'])->name('superadmin.home');
    Route::get('/super-admin/all-deleted-users', [SuperAdminController::class, 'allDeletedUsers'])->name('superadmin.allDeletedUsers');

    Route::post('/super-admin/toggle-delete-status/{user}', [SuperAdminController::class, 'toggleDeleteStatus'])->name('superadmin.toggleDeleteStatus');

    Route::post('/super-admin/toggle-activation-status/{user}', [SuperAdminController::class, 'toggleActivationStatus'])->name('superadmin.toggleActivationStatus');

    Route::post('/super-admin/toggle-admin-status/{user}', [SuperAdminController::class, 'toggleAdminStatus'])->name('superadmin.toggleAdminStatus');

    Route::post('/super-admin/toggle-employee-status/{user}', [SuperAdminController::class, 'toggleEmployeeStatus'])->name('superadmin.toggleEmployeeStatus');
    
    Route::get('/super-admin/register', [SuperAdminController::class, 'showRegisterForm'])->name('superadmin.showRegisterForm');

     Route::post('/super-admin/register', [RegisteredUserController::class, 'store'])
        ->name('superadmin.register');

    //   Route::post('register', [RegisteredUserController::class, 'create'])
        // ->name('superadmin.register');
});