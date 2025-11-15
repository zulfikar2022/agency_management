<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerProductController extends Controller
{
    public function sellProductToCustomerPage($id){
        $user =  request()->get('user');
        $productsNames = Product::select('name', 'id')->where('is_deleted', false)->where('is_available', true)->get();
        $customer = Customer::findOrFail($id);
        return Inertia::render('Admin/Customers/CustomerProduct/SellProduct', [
            'customer' => $customer, 
            'products' => $productsNames,
            'user_id' => $user->id
        ]);
    }

    public function sellProductToCustomer(Request $request){
        // validate the request
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'total_payable_price' => 'required|numeric|min:0',
            'downpayment' => 'required|numeric|min:0',
            'weekly_payable_price' => 'required|numeric|min:0',

        ]);
        // dd($validatedData);
        $customerProduct = new CustomerProduct($validatedData);
        $customerProduct->remaining_payable_price = $validatedData['total_payable_price'] - $validatedData['downpayment'];
        $customerProduct->save();

        // logic to sell product to customer goes here
        // e.g., create a record in a pivot table, update product stock, etc.

        // return redirect()->back()->with('success', 'Product sold to customer successfully.');
        return redirect()->route('admin.showCustomerDetails', ['id' => $validatedData['customer_id']]);
    }
}
