<?php

use App\Http\Controllers\Bank\DepositController;
use App\Http\Controllers\Bank\MemberController;
use App\Http\Controllers\EmployeeController\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','employeeonly']], function(){
    Route::get('/employee/bank/members', [EmployeeController::class, 'allBankMembers'])->name('employee.bank.members');

    Route::get('/employee/bank/collect-deposit/{member}', [DepositController::class, 'create'])->name('employee.bank.collect_deposit');

    Route::post('/employee/bank/store-deposit', [DepositController::class, 'store'])->name('employee.bank.store_deposit');

    Route::get('/employee/bank/not-deposited-today', [DepositController::class, 'notDepositedToday'])->name('employee.bank.not_deposited_today');
});