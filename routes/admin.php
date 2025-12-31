<?php

use App\Http\Controllers\AdminController\AdminController;
use App\Http\Controllers\CostController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\EmployeeController\EmployeeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCustomerMoneyCollectionController;
use App\Http\Controllers\ProductRerportGenerationController;
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

// route for downloading customer detail report
Route::get('/admin/download-customer-report/{id}', [CustomerController::class, 'downloadCustomerDetailReport'])->name('admin.downloadCustomerDetailReport');

// route for downloading today's collection report
Route::get('/admin/download-todays-collection-report', [ProductCustomerMoneyCollectionController::class, 'downloadTodaysCollectionReport'])->name('admin.downloadTodaysCollectionReport');

// employee wise reports front end
Route::get('/admin/employee-wise-product-reports', [AdminController::class, 'employeeWiseProductReportsPage'])->name('admin.employeeWiseProductReportsPage');


// admin.product.employee_wise_collection_report
Route::get('/admin/product-employee-wise-collection-report', [ProductRerportGenerationController::class, 'generateEmployeeWiseProductCollectionReport'])->name('admin.product.employee_wise_collection_report');

Route::get('/admin/report-generation-page', [AdminController::class, 'reportGenerationPage'])->name('admin.reportGenerationPage');

// admin.product.generate_sales_report
Route::get('/admin/product-generate-sales-report', [ProductRerportGenerationController::class, 'generateProductSalesReport'])->name('admin.product.generate_sales_report');

Route::get('/admin/product-generate-brief-sales-report', [ProductRerportGenerationController::class, 'generateBriefProductSalesReport'])->name('admin.product.generate_brief_sales_report');

//admin.product.generate_collection_report
Route::get('/admin/product-generate-collection-report', [ProductRerportGenerationController::class, 'generateProductCollectionReport'])->name('admin.product.generate_collection_report');

Route::get('/admin/product-generate-brief-collection-report', [ProductRerportGenerationController::class, 'generateBriefProductCollectionReport'])->name('admin.product.generate_brief_collection_report');

// product employee wise collection
Route::get('/admin/product/employee-wise-collection', [AdminController::class, 'productEmployeeWiseCollectionPage'])->name('admin.product.employeeWiseCollectionPage');



 


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

// route for customer have paid today 
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


// show all users route
Route::get('/admin/users', [AdminController::class, 'showAllUsers'])->name('admin.showAllUsers');

// employee power toggle route
Route::post('/admin/toggle-employee-power', [AdminController::class, 'toggleEmployeePower'])->name('admin.toggleEmployeePower');

Route::get('/admin/create-cost', [CostController::class, 'create'])->name('admin.createCost');
Route::post('/admin/store-cost', [CostController::class, 'store'])->name('admin.storeCost');

Route::get('/admin/costs', [CostController::class, 'index'])->name('admin.showCosts');

Route::get('/admin/edit-cost/{cost}', [CostController::class, 'edit'])->name('admin.editCost');

Route::put('/admin/update-cost', [CostController::class, 'update'])->name('admin.updateCost');

Route::get('/admin/create-report', [AdminController::class, 'createReportPage'])->name('admin.createReportPage');

Route::get('/admin/generate-cost-details-report', [CostController::class, 'generateCostDetailsReport'])->name('admin.generateCostDetailsReport');

Route::get('/admin/generate-brief-cost-report', [CostController::class, 'generateBriefCostReport'])->name('admin.generateBriefCostReport');

});