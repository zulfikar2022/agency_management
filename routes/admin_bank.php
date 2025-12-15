<?php

use App\Http\Controllers\Bank\MemberController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','adminonly']], function(){
    Route::get('/admin/bank', [MemberController::class, 'index'])->name('admin.bank.members');

    Route::get('/admin/bank/add-new-member', [MemberController::class, 'create'])->name('admin.bank.add_new_member');

    Route::get('/admin/bank/all-depositing-members', [MemberController::class, 'allDepositingMembers'])->name('admin.bank.all_depositing_members');

    Route::get('/admin/bank/all-loan-members', [MemberController::class, 'allLoanMembers'])->name('admin.bank.all_loan_members');

    Route::get('/admin/bank/deposited-today', [MemberController::class, 'depositedToday'])->name('admin.bank.deposited_today');

    Route::get('/admin/bank/provided-installment-today', [MemberController::class, 'providedInstallmentToday'])->name('admin.bank.provided_installment_today');

    Route::get('/admin/bank/not-deposited-today', [MemberController::class, 'notDepositedToday'])->name('admin.bank.not_deposited_today');

    Route::get('/admin/bank/not-installmented-today', [MemberController::class, 'notInstallmentedToday'])->name('admin.bank.not_installmented_today');

    Route::post('/admin/bank/store-customer', [MemberController::class, 'store'])->name('admin.bank.storeCustomer');
});