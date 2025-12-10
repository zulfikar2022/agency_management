<?php

use App\Http\Controllers\Bank\MemberController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','adminonly']], function(){
    Route::get('/admin/bank', [MemberController::class, 'index'])->name('admin.bank.members');
});