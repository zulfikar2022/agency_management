<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerProductController extends Controller
{
    public function sellProductToCustomerPage($id){
        $user =  request()->get('user');
        $productsNames = Product::select('name', 'id', 'supplier_name')->where('is_deleted', false)->where('is_available', true)->orderBy('created_at', 'desc')->get();
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
        DB::transaction(function() use ($validatedData) {
            $customerProduct = new CustomerProduct($validatedData);
            $customerProduct->remaining_payable_price = $validatedData['total_payable_price'] - $validatedData['downpayment'];
            $customerProduct->save();
            // reduce the product stock
            $product = Product::findOrFail($validatedData['product_id']);
            $product->current_quantity -= $validatedData['quantity'];
            $product->save();
        });
        
        return redirect()->route('admin.showCustomerDetails', ['id' => $validatedData['customer_id']]);
    }

  
}
