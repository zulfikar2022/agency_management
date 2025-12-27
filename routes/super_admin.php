<?php

use App\Http\Controllers\SuperAdminController\SuperAdminController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','superadminonly']], function () {
    // Super Admin dashboard route
    Route::get('/super-admin/all-users', [SuperAdminController::class, 'allUsers'])->name('superadmin.home');
    Route::get('/super-admin/all-deleted-users', [SuperAdminController::class, 'allDeletedUsers'])->name('superadmin.allDeletedUsers');

    Route::post('/super-admin/toggle-delete-status/{user}', [SuperAdminController::class, 'toggleDeleteStatus'])->name('superadmin.toggleDeleteStatus');
    // Route::get('/super-admin/register-user', [])->name('superadmin.registerUser');
});