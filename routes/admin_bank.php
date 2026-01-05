<?php

use App\Http\Controllers\AdminController\AdminController;
use App\Http\Controllers\Bank\BankReportGenerationController;
use App\Http\Controllers\Bank\DepositController;
use App\Http\Controllers\Bank\LoanController;
use App\Http\Controllers\Bank\MemberController;
use App\Http\Controllers\DataEntryController;
use App\Http\Controllers\DepositDismissalController;
use App\Http\Controllers\WithdrawController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','adminonly']], function(){
    Route::get('/admin/bank', [MemberController::class, 'index'])->name('admin.bank.members');

    Route::get('/admin/bank/add-new-member', [MemberController::class, 'create'])->name('admin.bank.add_new_member');

    Route::get('/admin/bank/delete-member-account/{member}', [MemberController::class, 'renderDeleteMemberAccount'])->name('admin.bank.delete_member_account_page');

    Route::delete('/admin/bank/delete-member-account/{member}', [MemberController::class, 'deleteMemberAccount'])->name('admin.bank.delete_member_account');

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

    Route::patch('/admin/bank/update-deposit', [DepositController::class, 'update'])->name('admin.bank.update_deposit');

    Route::get('/admin/bank/edit-loan/{loan}', [LoanController::class, 'edit'])->name('admin.bank.edit_loan');

    Route::patch('/admin/bank/update-loan/{loan}', [LoanController::class, 'update'])->name('admin.bank.update_loan');

    Route::get('/admin/bank/generate-member-details-report/{member}', [MemberController::class, 'generateMemberDetailsReport'])->name('admin.bank.generate_member_details_report');

    Route::get('/admin/bank/generate-member-deposit-report/{member}', [MemberController::class, 'generateMemberDepositReport'])->name('admin.bank.generate_member_deposit_report');

    Route::get('/admin/bank/generate-member-loan-collection-report/{member}', [MemberController::class, 'generateMemberLoanCollectionReport'])->name('admin.bank.generate_member_loan_collection_report');

    Route::get('/admin/bank/generate-member-withdraw-report/{member}', [MemberController::class, 'generateMemberWithdrawReport'])->name('admin.bank.generate_member_withdraw_report');

    Route::get('/admin/bank/report-generate', [AdminController::class, 'reportGenerate'])->name('admin.bank.report_generate');

    Route::get('/admin/bank/generate-deposit-collection-report', [BankReportGenerationController::class, 'generateDepositCollectionReport'])->name('admin.bank.generate_deposit_collection_report');

    Route::get('/admin/bank/generate-breif-deposit-collection-report', [BankReportGenerationController::class, 'generateBriefDepositCollectionReport'])->name('admin.bank.generate_brief_deposit_collection_report');

    

    Route::get('/admin/bank/generate-loan-collection-report', [BankReportGenerationController::class, 'generateLoanCollectionReport'])->name('admin.bank.generate_loan_collection_report');

    Route::get('/admin/bank/generate-brief-loan-collection-report', [BankReportGenerationController::class, 'generateBriefLoanCollectionReport'])->name('admin.bank.generate_brief_loan_collection_report');

    Route::get('/admin/bank/generate-withdraw-report', [BankReportGenerationController::class, 'generateWithdrawReport'])->name('admin.bank.generate_withdraw_report');

    Route::get('/admin/bank/generate-brief-withdraw-report', [BankReportGenerationController::class, 'generateBriefWithdrawReport'])->name('admin.bank.generate_brief_withdraw_report');

    Route::get('/admin/bank/generate-loans-report', [BankReportGenerationController::class, 'generateLoansReport'])->name('admin.bank.generate_loans_report');

    Route::get('/admin/bank/generate-brief-loans-report', [BankReportGenerationController::class, 'generateBriefLoansReport'])->name('admin.bank.generate_brief_loans_report');

    Route::get('/admin/bank/generate-deposits-report', [BankReportGenerationController::class, 'generateDepositReport'])->name('admin.bank.generate_deposits_report');

    Route::get('/admin/bank/employee-wise-collection', [BankReportGenerationController::class, 'employeeWiseCollectionReport'])->name('admin.bank.employee_wise_collection_report');

    Route::get('/admin/bank/generate-employee-wise-collection-report', [BankReportGenerationController::class, 'generateEmployeeWiseCollectionReport'])->name('admin.bank.generate_employee_wise_collection_report');

    // show all users route
    Route::get('/admin/bank/all-users', [AdminController::class, 'allUsersForBank'])->name('admin.bank.all_users');

    Route::get('/admin/bank/employee-wise-collection-report', [AdminController::class, 'employeeWiseCollectionReport'])->name('admin.bank.employee_wise_collection_report_web');

    Route::get('/admin/bank/deposit-dismissal/{deposit}', [DepositDismissalController::class, 'depositDismissalForm'])->name('admin.bank.deposit_dismissal_form');

    Route::post('/admin/bank/deposit-dismissal-store', [DepositDismissalController::class, 'store'])->name('admin.bank.deposit_dismissal.store');

    // DATA ENTRY routes
    Route::get('/admin/bank/de/all-members',[DataEntryController::class, 'seeAllMembers'])->name('admin.bank.de.all_members');

    Route::get('/admin/bank/de/member-details/{member}',[DataEntryController::class, 'memberDetails'])->name('admin.bank.de.member_details');

    Route::get('/admin/bank/de/collect-deposit/{member}',[DataEntryController::class, 'collectDeposit'])->name('admin.bank.de.collect_deposit');

    Route::post('/admin/bank/de/save-deposit',[DataEntryController::class, 'saveDeposit'])->name('admin.bank.de.save_deposit');

    Route::delete('/admin/bank/de/delete-member/{member}',[DataEntryController::class, 'deleteMember'])->name('admin.bank.de.delete_member');

    Route::get('/admin/bank/de/provide-loan/{member}',[DataEntryController::class, 'provideLoan'])->name('admin.bank.de.provide_loan');

    Route::post('/admin/bank/de/save-loan',[DataEntryController::class, 'saveLoan'])->name('admin.bank.de.save_loan');

    Route::get('/admin/bank/de/collect-loan/{member}',[DataEntryController::class, 'collectLoan'])->name('admin.bank.de.collect_loan');

    Route::post('/admin/bank/de/collect-loan-save',[DataEntryController::class, 'collectLoanSave'])->name('admin.bank.de.collect_loan_save');


    
});