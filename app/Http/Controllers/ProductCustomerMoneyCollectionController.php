<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Dues;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductCustomerMoneyCollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($id)
    {
        $user = request()->get('user');
        $customer = Customer::findOrFail($id);
        $purchases = CustomerProduct::where('customer_id', $customer->id)
            ->where('is_deleted', false)
            ->where('remaining_payable_price', '>', 0)
            ->get();
        
        $purchases->transform(function ($purchase) {
            $product = Product::find($purchase->product_id);
            $purchase->product = $product;
            return $purchase;
        });

        $collections = ProductCustomerMoneyCollection::where('customer_id', $customer->id)
            ->orderBy('collecting_date', 'desc')
            ->get();
       

        return Inertia::render('Employee/Products/CollectionPage', [
            'user' => $user,
            'customer' => $customer, 
            'purchases' => $purchases,
            'collections' => $collections
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->get('user');
              
        $validated_data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'collectable_amount' => 'required|array',
            'collected_amount' => 'required|array',
            'customer_product_id' => 'required|array',
        ]);

        // get the todays date in the following format Y-m-d
        $today_date = date('Y-m-d');
        $customerHasPaidToday = ProductCustomerMoneyCollection::where('customer_id', $validated_data['customer_id'])
            ->where('collecting_date', $today_date)
            ->exists();
        // dd($customerHasPaidToday);
        if($customerHasPaidToday){
            // send an error back to the previous page
            return redirect()->back()->withErrors(['error' => 'এই গ্রাহক আজকের তারিখে ইতিমধ্যে পেমেন্ট করেছেন।']);
        }

        // loop through each purchase id and create a record in the product_customer_money_collections table
        $updatingFailed = false;
        DB::transaction(function () use ($validated_data, $user, &$updatingFailed) {
 
            $purchases_ids = $validated_data['customer_product_id'];
            
            
            foreach ($purchases_ids as $index => $purchase_id) {
               

                // from the customer_products table (using the CustomerProduct model) update the remaining_payable_amount
                $customerProduct = CustomerProduct::find($validated_data['customer_product_id'][$index]);
                if ($customerProduct  && $customerProduct->remaining_payable_price >= $validated_data['collected_amount'][$index]) {
                    $customerProduct->remaining_payable_price -= $validated_data['collected_amount'][$index];
                    $customerProduct->save();
                    
                     ProductCustomerMoneyCollection::create([
                    'customer_id' => $validated_data['customer_id'], 
                    'collectable_amount' => $validated_data['collectable_amount'][$index],
                    'collected_amount' => $validated_data['collected_amount'][$index],
                    'collecting_date' => now(),
                    'collecting_user_id' => $user->id,
                    'customer_products_id' => $validated_data['customer_product_id'][$index],
                ]);

                    if ($validated_data['collected_amount'][$index] < $validated_data['collectable_amount'][$index]) {
                        $due_amount = $validated_data['collectable_amount'][$index] - $validated_data['collected_amount'][$index];
                        Dues::create([
                            'customer_id' => $validated_data['customer_id'],
                            'customer_product_id' => $validated_data['customer_product_id'][$index],
                            'due_amount' => $due_amount,
                        ]);
                    }

                } else{
                    $updatingFailed = true;
                }
               

                // if the collected amount is less than the collectable amount,  create a due record
               
            }
        });

        if($updatingFailed){
            return redirect()->back()->withErrors(['error' => 'অনুগ্রহ করে সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।']);
        }

        return redirect()->back()->with('success', 'Payment collected successfully.');
        
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCustomerMoneyCollection $productCustomerMoneyCollection)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(String $collection_id)
    {
        // dd($collection_id);
        $user = request()->get('user');
        
        // the collection id is in form 34-45-63 where each number is the id of a collection made on the same day
        $collection_ids = explode('-', $collection_id);
        $collections = ProductCustomerMoneyCollection::whereIn('id', $collection_ids)
            ->get();
        $customer_products_ids = $collections->pluck('customer_products_id')->unique();

        // based on the customer_products_ids get the customers_products from the customer_products table
        $customer_products = CustomerProduct::whereIn('id', $customer_products_ids)->get();
        $customer_products->transform(function ($customer_product) {
            $product = Product::find($customer_product->product_id);
            $customer_product->product = $product;
            return $customer_product;
        });

        
        
       
        if($collections->count() !== count($collection_ids)){
            return abort(404);
        }
        
        //get customers ids  in an array for each collection from each collection
        $customer_ids = $collections->pluck('customer_id')->unique();
        if($customer_ids->count() > 1){
            return abort(404);
        } 

        $customer = Customer::findOrFail($customer_ids->first());
        
        return Inertia::render('Employee/Products/UpdateCollectionPage', [
            'customer' => $customer, 
            'collections' => $collections, 
            'customer_products' => $customer_products,
        ]);

    

    
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated_data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'collection_ids' => 'required|array',
            'collected_amounts' => 'required|array',
        ]);

        // fetch all the entries from product_customer_money_collections table based on the customer_id
        $collections = ProductCustomerMoneyCollection::where('customer_id', $validated_data['customer_id'])->get();
        if($collections->count() == 0){
            return abort(404);
        }

        // from the collections separates only the collections that are in the collection_ids array
        $collections_to_update = $collections->whereIn('id', $validated_data['collection_ids'])->toArray();
        // now filter those which are not going to be updated
        $collections_not_to_update = [];

        

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCustomerMoneyCollection $productCustomerMoneyCollection)
    {
        //
    }
}
