<?php

use App\Http\Controllers\Bank\DepositController;
use App\Http\Controllers\Bank\LoanController;
use App\Http\Controllers\Bank\MemberController;
use App\Http\Controllers\WithdrawController;
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

    Route::get('/admin/bank/deposit-account/{member}', [MemberController::class, 'depositAccount'])->name('admin.bank.deposit_account');
    Route::post('/admin/bank/create-deposit-account/{member}', [MemberController::class, 'createDepositAccount'])->name('admin.bank.create_deposit_account');

    Route::get('/admin/bank/member-details/{member}', [MemberController::class, 'show'])->name('admin.bank.member_details');
    Route::get('/admin/bank/edit-member/{member}', [MemberController::class, 'edit'])->name('admin.bank.edit_member');

    Route::patch('/admin/bank/update-member/{member}', [MemberController::class, 'update'])->name('admin.bank.update_member');

    Route::get('/admin/bank/provide-loan/{member}', [LoanController::class, 'create'])->name('admin.bank.provide_loan');

    Route::post('/admin/bank/store-loan', [LoanController::class, 'store'])->name('admin.bank.store_loan');

    Route::get('/admin/bank/withdraw-money/{member}', [WithdrawController::class, 'withdrawMoney'])->name('admin.bank.withdraw_money');

    Route::post('/admin/bank/store-withdraw-money', [WithdrawController::class, 'store'])->name('admin.bank.store_withdraw_money');

    Route::get('/admin/bank/withdraw-list/{deposit}', [WithdrawController::class, 'withdrawLists'])->name('admin.bank.withdraw_lists');

    Route::get('/admin/bank/withdraw-update/{withdraw}', [WithdrawController::class, 'edit'])->name('admin.bank.withdraw_update');

    Route::patch('/admin/bank/save-updated-withdraw/{withdraw}', [WithdrawController::class, 'update'])->name('admin.bank.update_withdraw');

    Route::get('/admin/bank/deposit-collections/{deposit}', [DepositController::class, 'depositCollections'])->name('admin.bank.deposit_collections');

    Route::get('/admin/bank/loan-installment-collections/{loan}', [LoanController::class, 'loanInstallmentCollections'])->name('admin.bank.loan_installment_collections');

    
});