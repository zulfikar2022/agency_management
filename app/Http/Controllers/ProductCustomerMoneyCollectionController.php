<?php

namespace App\Http\Controllers;

use App\Models\CustomerProduct;
use App\Models\Dues;
use App\Models\ProductCustomerMoneyCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    public function create()
    {
        //
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

        // loop through each purchase id and create a record in the product_customer_money_collections table
        DB::transaction(function () use ($validated_data, $user) {
 
            $purchases_ids = $validated_data['customer_product_id'];
            foreach ($purchases_ids as $index => $purchase_id) {
                ProductCustomerMoneyCollection::create([
                    'customer_id' => $validated_data['customer_id'], // ok
                    'collectable_amount' => $validated_data['collectable_amount'][$index],
                    'collected_amount' => $validated_data['collected_amount'][$index],
                    'collecting_date' => now(),
                    'collecting_user_id' => $user->id,
                    'customer_products_id' => $validated_data['customer_product_id'][$index],
                ]);

                // from the customer_products table (using the CustomerProduct model) update the remaining_payable_amount
                $customerProduct = CustomerProduct::find($validated_data['customer_product_id'][$index]);
                if ($customerProduct  && $customerProduct->remaining_payable_price >= $validated_data['collected_amount'][$index]) {
                    $customerProduct->remaining_payable_price -= $validated_data['collected_amount'][$index];
                    $customerProduct->save();
                }

                // if the collected amount is less than the collectable amount,  create a due record
                if ($validated_data['collected_amount'][$index] < $validated_data['collectable_amount'][$index]) {
                    $due_amount = $validated_data['collectable_amount'][$index] - $validated_data['collected_amount'][$index];
                    Dues::created([
                        'customer_id' => $validated_data['customer_id'],
                        'customer_product_id' => $validated_data['customer_product_id'][$index],
                        'due_amount' => $due_amount,
                    ]);
                }
            }
        });

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
    public function edit(ProductCustomerMoneyCollection $productCustomerMoneyCollection)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductCustomerMoneyCollection $productCustomerMoneyCollection)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCustomerMoneyCollection $productCustomerMoneyCollection)
    {
        //
    }
}
