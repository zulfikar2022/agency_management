<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\CustomerProductUpdateLog;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
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

    public function updateProductCustomerRenderPage($purchase_id){

        // fetch the customer_product details using the purchase_id
        $customerProduct = CustomerProduct::findOrFail($purchase_id);
        $customerId = $customerProduct->customer_id;
        $customer = Customer::findOrFail($customerId);
        // fetch the products which are not deleted and not unavailable
        $products = Product::where('is_deleted', false)
            ->where('is_available', true)
            ->get();

        return Inertia::render('Admin/Customers/CustomerProduct/UpdateSellProduct', [
            'purchase' => $customerProduct,
            'customer' => $customer,
            'products' => $products,
        ]);

    }

    public function saveUpdatedCustomerProduct(Request $request){
        // validate the request
        $validatedData = $request->validate([
            'purchase_id' => 'required|exists:customer_products,id',
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'total_payable_price' => 'required|numeric|min:0',
            'downpayment' => 'required|numeric|min:0',
            'weekly_payable_price' => 'required|numeric|min:0',
        ]);

        // fetch all the entries from cutomer_products_money_collections table for the customer_id
        $moneyCollections = ProductCustomerMoneyCollection::where('customer_id', $validatedData['customer_id'])->where('customer_products_id', $validatedData['purchase_id'])->get();

        //fetch the entry form customer_products table using purchase_id
        $customerProduct = CustomerProduct::findOrFail($validatedData['purchase_id']);

        // calculate the sum of collected_amount from money_collections
        $totalCollectedAmount = $moneyCollections->sum('collected_amount');

        if($validatedData['total_payable_price'] < $totalCollectedAmount + $validatedData['downpayment']){
            return redirect()->back()->withErrors(['error' => 'মোট মূল্যের পরিমাণ ইতিমধ্যেই সংগ্রহ করা হয়েছে, দয়া করে একটি বড় পরিমাণ প্রদান করুন।'])->withInput();
        }
        // if the subtraction between remaining_payable_price and downpayment is negative, return with error
        if ($customerProduct->remaining_payable_price - $validatedData['downpayment'] < 0) {
            return redirect()->back()->withErrors(['error' => 'বাকী পরিশোধের পরিমাণ নেতিবাচক হতে পারে না।'])->withInput();
        }

        // create an entry of customer_product_update_logs using the model CustomerProductUpdateLog
        CustomerProductUpdateLog::create([
            'customer_product_id' => $customerProduct->id,
            'quantity_before' => $customerProduct->quantity,
            'quantity_after' => $validatedData['quantity'],
            'total_payable_price_before' => $customerProduct->total_payable_price,
            'total_payable_price_after' => $validatedData['total_payable_price'],
            'downpayment_before' => $customerProduct->downpayment,
            'downpayment_after' => $validatedData['downpayment'],
            'weekly_payable_price_before' => $customerProduct->weekly_payable_price,
            'weekly_payable_price_after' => $validatedData['weekly_payable_price'],
            'updating_user_id' => $request->get('user')->id,
        ]);
        
        // from the product_customer_money_collections table, update the collectable_amount for each entry
        foreach($moneyCollections as $collection){
            $collection->collectable_amount = $validatedData['weekly_payable_price'];
            $collection->save();
        }

        // perform the update operation on customer_products table
        $customerProduct->product_id = $validatedData['product_id'];
        $customerProduct->quantity = $validatedData['quantity'];
        $customerProduct->total_payable_price = $validatedData['total_payable_price'];
        $customerProduct->downpayment = $validatedData['downpayment'];
        $customerProduct->weekly_payable_price = $validatedData['weekly_payable_price'];
        $customerProduct->remaining_payable_price = $validatedData['total_payable_price'] - $validatedData['downpayment'] - $totalCollectedAmount;


        $customerProduct->save();

        return redirect()->back()->with('success', 'বিক্রয় তথ্য সফলভাবে আপডেট করা হয়েছে।');

        
    }

  
}
