<?php

use App\Http\Controllers\Bank\DepositCollectionController;
use App\Http\Controllers\Bank\DepositController;
use App\Http\Controllers\Bank\LoanCollectionController;
use App\Http\Controllers\Bank\MemberController;
use App\Http\Controllers\EmployeeController\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','employeeonly']], function(){
    Route::get('/employee/bank/members', [EmployeeController::class, 'allBankMembers'])->name('employee.bank.members');

    Route::get('/employee/bank/collect-deposit/{member}', [DepositController::class, 'create'])->name('employee.bank.collect_deposit');

    Route::post('/employee/bank/store-deposit', [DepositController::class, 'store'])->name('employee.bank.store_deposit');

    Route::get('/employee/bank/not-deposited-today', [DepositController::class, 'notDepositedToday'])->name('employee.bank.not_deposited_today');

    Route::get('/employee/bank/member-details/{member}', [MemberController::class, 'memberDetailsForEmployee'])->name('employee.bank.member_details');

    Route::patch('/employee/bank/update-deposit/{depositCollection}', [DepositCollectionController::class, 'update'])->name('employee.bank.update_deposit');

    Route::get('/employee/bank/not-installment-today', [LoanCollectionController::class, 'notInstallmentedToday'])->name('employee.bank.not_installment_today');

    Route::get('/employee/bank/collect-installment/{member}', [LoanCollectionController::class, 'create'])->name('employee.bank.collect_installment');

    Route::post('/employee/bank/store-installment', [LoanCollectionController::class, 'store'])->name('employee.bank.store_installment');

    Route::patch('/employee/bank/update-installment/{loanCollection}', [LoanCollectionController::class, 'update'])->name('employee.bank.update_installment');

    Route::get('/employee/bank/deposit-and-loan-collection/{deposit}/{loan}', [EmployeeController::class, 'depositAndLoanCollection'])->name('employee.bank.depositAndLoanCollection');

    Route::post('/employee/bank/process-deposit-and-loan-collection', [EmployeeController::class, 'processDepositAndLoanCollection'])->name('employee.bank.processDepositAndLoanCollection');
});