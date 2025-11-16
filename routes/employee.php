<?php

use App\Http\Controllers\EmployeeController\EmployeeController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::group(['middleware' => ['auth','employeeonly']], function () {
    
    // employee dashboard route
Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->middleware(['auth'])->name('employee.dashboard');

// customers that have to pay today route
Route::get('/employee/customers-that-have-to-pay-today', [EmployeeController::class, 'customerThatPayToday'])->name('employee.customersThatPayToday');

// all customers route
Route::get('/employee/all-customers', [EmployeeController::class, 'allCustomers'])->name('employee.allCustomers');

// customers who paid today route
Route::get('/employee/customers-who-paid-today', [EmployeeController::class, 'customersPaidToday'])->name('employee.customersPaidToday');


// customers who didn't pay today route
Route::get('/employee/customers-who-didnt-pay-today', [EmployeeController::class, 'customersDidNotPayToday'])->name('employee.customersWhoDidntPayToday');

// today's collection route
Route::get('/employee/todays-collection', [EmployeeController::class, 'todaysCollection'])->name('employee.todaysCollection');

// today's status route
Route::get('/employee/todays-status', [EmployeeController::class, 'todaysStatus'])->name('employee.todaysStatus');

// render collection page route
Route::get('/employee/collection-page/{id}', [EmployeeController::class, 'renderCollectionPage'])->name('employee.renderCollectionPage');   


});