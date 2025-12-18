<?php
use App\Http\Controllers\Bank\MemberController;
use App\Http\Controllers\EmployeeController\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => ['auth','employeeonly']], function(){
    Route::get('/employee/bank/members', [EmployeeController::class, 'allBankMembers'])->name('employee.bank.members');
});