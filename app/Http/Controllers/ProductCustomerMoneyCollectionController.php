<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\CustomerProductUpdateLog;
use App\Models\Dues;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductCustomerMoneyCollectionUpdateLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $total_downpayment = $purchases->sum('downpayment');

        $collections = ProductCustomerMoneyCollection::where('customer_id', $customer->id)
            ->orderBy('collecting_date', 'desc')
            ->get();
       

        return Inertia::render('Employee/Products/CollectionPage', [
            'user' => $user,
            'customer' => $customer, 
            'purchases' => $purchases,
            'collections' => $collections,
            'total_downpayment' => $total_downpayment,
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

                    // if ($validated_data['collected_amount'][$index] < $validated_data['collectable_amount'][$index]) {
                    //     $due_amount = $validated_data['collectable_amount'][$index] - $validated_data['collected_amount'][$index];
                    //     Dues::create([
                    //         'customer_id' => $validated_data['customer_id'],
                    //         'customer_product_id' => $validated_data['customer_product_id'][$index],
                    //         'due_amount' => $due_amount,
                    //     ]);
                    // }

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

    public function markAsDue(Request $request)
    {
        $user = $request->get('user');
        
        $validated_data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'collectable_amount' => 'required|array',
            'collected_amount' => 'required|array',
            'customer_product_id' => 'required|array',
        ]);

          $today_date = date('Y-m-d');
        $customerHasPaidToday = ProductCustomerMoneyCollection::where('customer_id', $validated_data['customer_id'])
            ->where('collecting_date', $today_date)
            ->exists();
        
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
                    'collected_amount' => 0,
                    'collecting_date' => now(),
                    'collecting_user_id' => $user->id,
                    'customer_products_id' => $validated_data['customer_product_id'][$index],
                ]);

                    // if ($validated_data['collected_amount'][$index] < $validated_data['collectable_amount'][$index]) {
                    //     $due_amount = $validated_data['collectable_amount'][$index] - $validated_data['collected_amount'][$index];
                    //     Dues::create([
                    //         'customer_id' => $validated_data['customer_id'],
                    //         'customer_product_id' => $validated_data['customer_product_id'][$index],
                    //         'due_amount' => $due_amount,
                    //     ]);
                    // }

                } else{
                    $updatingFailed = true;
                }
               

                // if the collected amount is less than the collectable amount,  create a due record
               
            }
        });

        if($updatingFailed){
            return redirect()->back()->withErrors(['error' => 'অনুগ্রহ করে সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।']);
        }

        return redirect()->back()->with('success', 'সফলভাবে ডিউ হিসেবে চিহ্নিত করা হয়েছে।');
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
            'purchase_ids' => 'required|array',
        ]);

        $total_updated_collected_amount = array_sum($validated_data['collected_amounts']);



        // fetch all the entries from product_customer_money_collections table based on the customer_id
        $collections = ProductCustomerMoneyCollection::where('customer_id', $validated_data['customer_id'])->get();
        if($collections->count() == 0){
            return abort(404);
        }

        // from the collections separates only the collections that are in the collection_ids array
        $collections_to_update = $collections->whereIn('id', $validated_data['collection_ids'])->toArray();
        
        // now filter those which are not going to be updated
        $collections_not_to_update = array_filter($collections->toArray(), function ($collection) use ($validated_data) {
            return !in_array($collection['id'], $validated_data['collection_ids']);
        });

        $total_collected_amount_from_not_to_update = 0;
        // from the collections_not_to_update, find the sum of collected_amount into each collection and place the sum into total_collected_amount
        foreach ($collections_not_to_update as $collection) {
            $total_collected_amount_from_not_to_update += $collection['collected_amount'];
        }

        // using the customer_id, fetch all the customer_products where remaining_payable_price > 0
        $customer_products = CustomerProduct::where('customer_id', $validated_data['customer_id'])
            ->where('is_deleted', false)
            ->get();
        
        $total_payable_amount = 0;
        $total_downpayments = 0;
        // find the sum of remaining_payable_price into each customer_product and place the sum into total_payable_amount
        foreach ($customer_products as $customer_product) {
            $total_payable_amount += $customer_product->total_payable_price;
            $total_downpayments += $customer_product->downpayment;
        }

        if($total_collected_amount_from_not_to_update + $total_updated_collected_amount + $total_downpayments > $total_payable_amount) {
            return redirect()->back()->withErrors(['error' => 'আপডেটকৃত সংগ্রহের পরিমাণ মোট বকেয়া পরিমাণের চেয়ে বেশি হতে পারে না।']);
        }

        $updatable_customer_products = CustomerProduct::whereIn('id', $validated_data['purchase_ids'])->get();
        $updatable_collection_instances = ProductCustomerMoneyCollection::whereIn('id', $validated_data['collection_ids'])->get();
        
        // loop through updatable_collection_instances
        foreach ($updatable_collection_instances as $index => $collection_instance) {
            if($updatable_customer_products[$index]['remaining_payable_price']+$updatable_collection_instances[$index]['collected_amount'] - $validated_data['collected_amounts'][$index] < 0) {
                return redirect()->back()->withErrors(['error' => 'আপডেটকৃত সংগ্রহের পরিমাণ মোট বকেয়া পরিমাণের চেয়ে বেশি হতে পারে না।']);
            }
        }
        // dd(Auth::id());

        // dd("just before the transaction start");
        // create an instance of product_customer_money_collection_update_logs
        DB::transaction(function () use ($validated_data, $updatable_customer_products, $updatable_collection_instances) {
            foreach ($validated_data['collection_ids'] as $index => $collection_id) {
                // update each collection's collected_amount
                ProductCustomerMoneyCollectionUpdateLog::create([
                    'product_customer_money_collection_id' => $collection_id,
                    'updating_at' => now(),
                    'collected_amount_before' => $updatable_collection_instances[$index]['collected_amount'],
                    'collected_amount_after' => $validated_data['collected_amounts'][$index],
                    'collectable_amount_before' => $updatable_collection_instances[$index]['collectable_amount'],
                    'collectable_amount_after' => $updatable_collection_instances[$index]['collectable_amount'],
                    'updating_user_id' => Auth::id(),
                ]);

                // product customer update log
                CustomerProductUpdateLog::create([
                    'customer_product_id' => $updatable_customer_products[$index]['id'],
                    'remaining_payable_price_before' => $updatable_customer_products[$index]['remaining_payable_price'],
                    'remaining_payable_price_after' => $updatable_customer_products[$index]['remaining_payable_price'] + $updatable_collection_instances[$index]['collected_amount'] - $validated_data['collected_amounts'][$index],
                    'updating_user_id' => request()->get('user')->id,
                    'total_payable_price_before' => $updatable_customer_products[$index]['total_payable_price'],
                    'total_payable_price_after' => $updatable_customer_products[$index]['total_payable_price'],
                    'weekly_payable_price_before' => $updatable_customer_products[$index]['weekly_payable_price'],
                    'weekly_payable_price_after' => $updatable_customer_products[$index]['weekly_payable_price'],
                    
                ]);

                 // update the customer product instance
                $updatable_customer_products[$index]->remaining_payable_price = $updatable_customer_products[$index]['remaining_payable_price'] + $updatable_collection_instances[$index]['collected_amount'] - $validated_data['collected_amounts'][$index];
                $updatable_customer_products[$index]->save();


                // update the collection instance
                $updatable_collection_instances[$index]->collected_amount = $validated_data['collected_amounts'][$index];
                $updatable_collection_instances[$index]->save();    
            }
        });

        // return redirect()->back()->with('success', 'কালেকশন আপডেট সফল হয়েছে।');
        return redirect()->route('employee.renderCollectionPage', $validated_data['customer_id']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCustomerMoneyCollection $productCustomerMoneyCollection)
    {
        //
    }

    public function todaysCollections(Request $request){
        // $today = $request->input('today');
        $todate = $request->input('todate');
        //find out the day in the format saturday, sunday not from the todate, rahter using the system time and date
        $day = \Carbon\Carbon::now()->format('l');
        // $day = \Carbon\Carbon::parse($todate)->format('l');
        

        $collections = ProductCustomerMoneyCollection::where('collecting_date', $todate)->get();
        // each collection has a customer_id property and based on this id fetch the customer from customers table and put it to the collection instance as customer property
        $collections->transform(function ($collection) {
            $customer = Customer::find($collection->customer_id);
            $collection->customer = $customer;
            return $collection;
        });

        // each of the collections instance has a customer property named collected_amount. find the some of all collected_amount and place it into a variable named total_collected_amount
        // find the system date in the format yyyy-mm-dd
        $system_date = \Carbon\Carbon::now()->format('Y-m-d');

        $total_collected_amount = ProductCustomerMoneyCollection::where('collecting_date', $system_date)->get()->sum('collected_amount');

        // each collection has a customer_products_id property and based on this id fetch the customer_product from customer_products table and put the product_Id from the customer_product to the collection instance as product property
        $collections->transform(function ($collection) {
            $customer_product = CustomerProduct::find($collection->customer_products_id);
            if($customer_product){
                $product = Product::find($customer_product->product_id);
                $collection->product = $product;
            }
            return $collection;
        });

        $collections->transform(function ($collection) {
            $customer_product = CustomerProduct::find($collection->customer_products_id);
            $collection->customer_product = $customer_product;
            $isUpdated = ProductCustomerMoneyCollectionUpdateLog::where('product_customer_money_collection_id', $collection->id)->exists();
            $collection->is_updated = $isUpdated;
            return $collection;
        });

        // using the $day variable fetch all the customers id who are supposed to pay today and place them into an array. I don't want the cutomers. I just want to know the total receivable amount for today

        $customer_ids = Customer::where('collection_day', $day)->pluck('id')->toArray();
       // using the customer_ids array fetch all the instances from customer_products table where customer_id is in the customer_ids array and remaining_payable_price > 0
        $customer_products = CustomerProduct::whereIn('customer_id', $customer_ids)
            ->where('is_deleted', false)
            ->where('remaining_payable_price', '>', 0)
            ->get();
        // now find the total sum of weekly_payable_price from the customer_products instances
        $total_receivable_amount = $customer_products->sum('weekly_payable_price');
        

        return Inertia::render('Admin/Customers/CustomerCollection/TodaysCollection', [
            'collections' => $collections,
            'totalReceivableAmount' => $total_receivable_amount,
            'total_collected_amount' => $total_collected_amount,
        ]);
    }

    public function seeDetailsOfOneDayCollection(Request $request){
        $user = $request->get('user');
        $customer_id = $request->route('customer_id');
        $date = $request->route('date');
        
        $collections = ProductCustomerMoneyCollection::where('customer_id', $customer_id)
            ->where('collecting_date', $date)
            ->get();
        $collections->transform(function (ProductCustomerMoneyCollection $collection) {
            $product_customer = CustomerProduct::find($collection->customer_products_id);
            
            $product = Product::find($product_customer->product_id);
            $collection->product = $product;
            return $collection;
        });
        $collectionIds = $collections->pluck('id')->toArray();

        $collectionsUpdateLogs = ProductCustomerMoneyCollectionUpdateLog::whereIn('product_customer_money_collection_id', $collectionIds)->orderBy('created_at', 'desc')->get();
        $collectionsUpdateLogs->transform(function ($update) use ($collections) {
            $user = User::find($update->updating_user_id);
            $user->password = null;
            $update->updating_user = $user;

            $update->product = Product::find(CustomerProduct::find($collections->where('id', $update->product_customer_money_collection_id)->first()->customer_products_id)->product_id);
            return $update;
        });


        return Inertia::render('Admin/Customers/SingleCollectionDetails', [
            'collections' => $collections,
            'collectionsUpdateLogs' => $collectionsUpdateLogs,
        ]);

        

        
    }
}
