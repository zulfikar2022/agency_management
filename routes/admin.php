<?php

use App\Http\Controllers\AdminController\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\EmployeeController\EmployeeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCustomerMoneyCollectionController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




Route::group(['middleware' => ['auth','adminonly']], function () {
    
// admin dashboard route
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');


// create product route (render page)
Route::get('/admin/create-product', [ProductController::class, 'createProduct'])->name('admin.createProduct');
// store product route
Route::post('/admin/store-product', [ProductController::class, 'storeProduct'])->name('admin.storeProduct');


// show all products route
Route::get('/admin/products', [ProductController::class, 'showProducts'])->name('admin.showProducts');




// show available products route
Route::get('/admin/products/available', [ProductController::class, 'showAvailableProducts'])->name('admin.showAvailableProducts');



// show unavailable products route
Route::get('/admin/products/unavailable', [ProductController::class, 'showUnavailableProducts'])->name('admin.showUnavailableProducts');

// show all customers route
Route::get('/admin/customers', [CustomerController::class, 'index'])->name('admin.showCustomers');
// add customer route (render page)
Route::get('/admin/create-customer', [CustomerController::class, 'create'])->name('admin.createCustomer');

// store customer route
Route::post('/admin/store-customer', [CustomerController::class, 'store'])->name('admin.storeCustomer');




 


//================== DYNAMIC ROUTES =================   
// show product by id route
Route::get('/admin/products/{id}', [ProductController::class, 'showProductById'])->name('admin.showProductById');

// show update product page
Route::get('/admin/products/update/{id}', [ProductController::class, 'showUpdateProductPage'])->name('admin.showUpdateProductPage');

Route::put('/admin/products/update/{id}', [ProductController::class, 'updateProduct'])->name('admin.updateProduct');

Route::get('/admin/products/toggle-availability/{id}', [ProductController::class, 'toggleProductStatus'])->name('admin.toggleProductStatus');


// render edit customer page
Route::get('/admin/customers/edit/{id}', [CustomerController::class, 'edit'])->name('admin.editCustomer');
// save the updated customer info
Route::put('/admin/customers/update/{id}', [CustomerController::class, 'update'])->name('admin.updateCustomer');
// show customer details

// route for showing customers who will have to pay today
Route::get('/admin/customers/have-to-pay-today', [CustomerController::class, 'customerThatPayToday'])->name('admin.haveToPayToday');

// route for customers who have not paid today
Route::get('/admin/customers/not-paid-today', [CustomerController::class, 'customersDidNotPayToday'])->name('admin.customersDidNotPayToday');

// todays collections
Route::get('/admin/customers/todays-collections', [ProductCustomerMoneyCollectionController::class, 'todaysCollections'])->name('admin.todaysCollections');

// route for customer have to paid today 
Route::get('/admin/customers/paid-today', [CustomerController::class, 'customersPaidToday'])->name('admin.customerHaveToPayToday');
// delete customer

// route for show customer details
Route::get('/admin/customers/{id}', [CustomerController::class, 'show'])->name('admin.showCustomerDetails');


Route::delete('/admin/customers/delete/{id}', [CustomerController::class, 'destroy'])->name('admin.deleteCustomer');

// show page for selling product to customer
Route::get('/admin/customers/{id}/sell-product', [CustomerProductController::class, 'sellProductToCustomerPage'])->name('admin.sellProductToCustomerPage');

// show all collections of a customer on a specific day
Route::get('/admin/customers/{customer_id}/collections/{date}', [ProductCustomerMoneyCollectionController::class, 'seeDetailsOfOneDayCollection'])->name('admin.showCustomersCollectionsOnDate');

// render update sell product page
Route::get('/admin/customers/purchases/update/{purchase_id}', [CustomerProductController::class, 'updateProductCustomerRenderPage'])->name('admin.updateProductCustomerRenderPage');

// save the updated sold product to customer
Route::put('/admin/customers/purchases/update', [CustomerProductController::class, 'saveUpdatedCustomerProduct'])->name('admin.saveUpdatedCustomerProduct');

// save the sold product to customer
Route::post('/admin/customers/sell-product', [CustomerProductController::class, 'sellProductToCustomer'])->name('admin.sellProductToCustomer');

// show customer specific purchase details
Route::get('/admin/customers/{customer_id}/purchases/{purchase_id}', [CustomerController::class, 'showCustomerPurchases'])->name('admin.showCustomerPurchaseDetails');

// Route::get('/admin/customers/{customer_id}/collections?todate=', [CustomerController::class, 'showCustomerCollections'])->name('admin.showCustomerCollectionDetails');




});