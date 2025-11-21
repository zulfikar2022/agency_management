<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductCustomerMoneyCollectionUpdateLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user =  request()->get('user');
        $searchTerm = request()->query('search', '');
        // dd($user);
        // dd($searchTerm);
        $customers = Customer::where('is_deleted', false)
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('phone_number', 'like', '%' . $searchTerm . '%')
                      ->orWhere('address', 'like', '%' . $searchTerm . '%')
                      ->orWhere('nid_number', 'like', '%' . $searchTerm . '%')
                      ->orWhere('fathers_name', 'like', '%' . $searchTerm . '%')->orWhere('mothers_name', 'like', '%' . $searchTerm . '%')
                      ->orWhere('collection_day', 'like', '%' . $searchTerm . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        
        $totalCustomers = Customer::where('is_deleted', false)->count();
        
        return Inertia::render('Admin/Customers/ShowAllCustomers', [
            'customers' => $customers,
            'user' => $user,
            'totalCustomers' => $totalCustomers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user =  request()->get('user');
        return Inertia::render('Admin/Customers/CreateCustomer', [
            'user' => $user,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:12',
            'address' => 'required|string|max:500',
            'collection_day' => 'required|string|in:saturday,sunday,monday,tuesday,wednesday,thursday,friday',
            'nid_number' => 'nullable|string|max:20',
            'fathers_name' => 'nullable|string|max:255',
            'mothers_name' => 'nullable|string|max:255',
        ]);
        // dd($validatedData);

        

        Customer::create($validatedData);
        // dd($validatedData);

        return redirect()->route('admin.createCustomer')->with('success', 'Customer created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id)
    {
        $leanUser = request()->get('user');
        $customer = Customer::findOrFail($id);
        $purchagesLists = CustomerProduct::where('customer_id', $customer->id)->where('is_deleted', false)->get();
        // each of the purchasesLists item holda property named total_payable_price, find the sum of all total_payable_price where is_deleted is false and remaining_payable_price > 0
        $total_payable_price = $purchagesLists->where('remaining_payable_price', '>', 0)->sum('total_payable_price');
        // find the total downpayment amount from the purchasesLists
        $total_downpayment_amount = $purchagesLists->where('remaining_payable_price', '>', 0)->sum('downpayment');

        $paymentLists = ProductCustomerMoneyCollection::where('customer_id',  $customer->id)->orderBy('created_at', 'desc')->get();
        $purchagedProducts = $purchagesLists->map(function ($item) {
            $product = Product::find($item->product_id);
            $item['product'] = $product;
            return $item;
        });

        // each entry from paymentList has a customer_products_id property, using which fetch the corresponding purchase details from the customer_produdcts table
        $paymentLists = $paymentLists->map(function ($item) use ($purchagedProducts) {
            $purchase = $purchagedProducts->find($item->customer_products_id);
            $item['purchase'] = $purchase;
            $isUpdated = ProductCustomerMoneyCollectionUpdateLog::where('product_customer_money_collection_id', $item->id)->exists();
            $item['isUpdated'] = $isUpdated;
            $collectingUser = User::find($item->collecting_user_id)->only('id', 'name', 'is_admin', 'is_employee');
            $item['collectingUser'] = $collectingUser;
            return $item;
        });

        return Inertia::render('Admin/Customers/ShowCustomerDetails', [
            'user' => $leanUser,
            'customer' => $customer,
            'purchagedProducts' => $purchagedProducts,
            'paymentLists' => $paymentLists,
            'total_payable_price' => $total_payable_price,
            'total_downpayment' => $total_downpayment_amount,
            
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $customer = Customer::findOrFail($id);
        $user = request()->get('user');
        // dd($customer);
        return Inertia::render('Admin/Customers/UpdateCustomer', [
            'customer' => $customer,
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, String $id)
    {
        $customer = Customer::findOrFail($id);
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:12',
            'address' => 'required|string|max:500',
            'collection_day' => 'required|string|in:saturday,sunday,monday,tuesday,wednesday,thursday,friday',
            'nid_number' => 'nullable|string|max:20',
            'fathers_name' => 'nullable|string|max:255',
            'mothers_name' => 'nullable|string|max:255',
        ]);

        $customer->update($validatedData);
        

        return redirect()->route('admin.showCustomerDetails',$customer->id)->with('success', 'Customer updated successfully.');
        // return redirect()->back()->with('success', 'Customer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        // dd($id);
        $customer = Customer::findOrFail($id);
        $customer->is_deleted = true;
        $customer->save();
        

        return redirect()->route('admin.showCustomers')->with('success', 'Customer deleted successfully.');
    }

    // customer specific purchase details
    public function showCustomerPurchases(String $customer_id, String $purchase_id){
        
            $customer = Customer::findOrFail($customer_id);
            
            $purchase = CustomerProduct::where('customer_id', $customer->id)->findOrFail($purchase_id);

            $paymentList = ProductCustomerMoneyCollection::where('customer_id', $customer->id)
                            ->where('customer_products_id', $purchase->id)
                            ->get();
            
            $product = Product::findOrFail($purchase->product_id);
            // dd($product);
            $purchase['product'] = $product;
            
            return Inertia::render('Admin/Customers/ShowCustomerPurchaseDetails', [
                'customer' => $customer,
                'purchase' => $purchase,
                'paymentList' => $paymentList,
            ]);
    }

    public function customerThatPayToday(){


       $user = request()->get('user');
       $today = request()->query('today');
       $search = request()->query('search', '');

    // implement search functionality   
    $customers = Customer::where('is_deleted', false)
        ->where('collection_day', $today)
        ->where(function ($query) use ($search) {
        $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('phone_number', 'like', '%' . $search . '%')
                ->orWhere('address', 'like', '%' . $search . '%')
                ->orWhere('nid_number', 'like', '%' . $search . '%')
                ->orWhere('fathers_name', 'like', '%' . $search . '%')
                ->orWhere('mothers_name', 'like', '%' . $search . '%')
                ->orWhere('id', 'like', '%' . $search . '%');
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10);
         $customers->getCollection()->transform(function ($customer) {
                    $purchases = CustomerProduct::where('customer_id', $customer->id)
                        ->where('is_deleted', false)
                        ->get();
                    $customer->purchases = $purchases;
                    return $customer;
                });
    $totalCustomers = Customer::where('is_deleted', false)
        ->where('collection_day', $today)
        ->count();

    return Inertia::render('Admin/Customers/CustomerCollection/HaveToPayToday', [
        'user' => $user,
        'customers' => $customers,
        'totalCustomers' => $totalCustomers
    ]);
    }

    public function customersPaidToday(){
        $user = request()->get('user');
        $today = request()->query('todate');
        $search = request()->query('search', '');

        // make the following array unique

        $customersIds = ProductCustomerMoneyCollection::where('collecting_date', $today)
            ->pluck('customer_id')
            ->toArray();
        $customersIds = array_unique($customersIds);

        // fetch customers by ids
        $customers = Customer::whereIn('id', $customersIds)
            ->where('is_deleted', false)
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('phone_number', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhere('nid_number', 'like', '%' . $search . '%')
                    ->orWhere('fathers_name', 'like', '%' . $search . '%')
                    ->orWhere('id', 'like', '%' . $search . '%')
                    ->orWhere('mothers_name', 'like', '%' . $search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

             $customers->getCollection()->transform(function ($customer) {
                    $purchases = CustomerProduct::where('customer_id', $customer->id)
                        ->where('is_deleted', false)
                        ->get();
                    $customer->purchases = $purchases;
                    return $customer;
                });
        // $totalCustomers = Customer::where('is_deleted', false)->count();
        $totalCustomers = count($customersIds);
        return Inertia::render('Admin/Customers/CustomerCollection/HavePaidToday', [
            'user' => $user,
            'customers' => $customers,
            'totalCustomers' => $totalCustomers
        ]);
    }

      public function customersDidNotPayToday(){
        $user = request()->get('user');
        $todate = request()->query('todate');
        $today =  request()->query('today');
        $search = request()->query('search', '');

        // $customersIdsPaidToday = ProductCustomerMoneyCollection::where('collecting_date', $todate)
        //     ->pluck('customer_id')
        //     ->toArray();
        // $customersIdsPaidToday = array_unique($customersIdsPaidToday);
            
        $customersIds = ProductCustomerMoneyCollection::where('collecting_date', $todate)
            ->pluck('customer_id')
            ->toArray();
        // fetch customers who are not in the above ids
        $customers = Customer::whereNotIn('id', $customersIds)
            ->where('is_deleted', false)
            ->where('collection_day', $today)
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('phone_number', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhere('nid_number', 'like', '%' . $search . '%')
                    ->orWhere('fathers_name', 'like', '%' . $search . '%')
                    ->orWhere('id', 'like', '%' . $search . '%')
                    ->orWhere('mothers_name', 'like', '%' . $search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

             $customers->getCollection()->transform(function ($customer) {
                    $purchases = CustomerProduct::where('customer_id', $customer->id)
                        ->where('is_deleted', false)
                        ->get();
                    $customer->purchases = $purchases;
                    return $customer;
                });

                // make the customerIds unique
        $customersIds = array_unique($customersIds);
        return Inertia::render('Admin/Customers/CustomerCollection/HaveNotPaidToday', [
            'user' => $user,
            'customers' => $customers, 
            'totalCustomers' => count($customersIds)
        ]);
    }
}
