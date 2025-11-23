<?php 

namespace App\Http\Controllers\EmployeeController;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductCustomerMoneyCollectionUpdateLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class EmployeeController extends Controller
{
    public function dashboard(){
        
        $user = request()->get('user');
        return Inertia::render('Employee/Dashboard', [
            'user' => $user
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

    return Inertia::render('Employee/Products/HaveToPayToday', [
        'user' => $user,
        'customers' => $customers,
        'totalCustomers' => $totalCustomers
    ]);
    }

    // all customers with search and filter by day functionality
    public function allCustomers(){ //COMPLETED BOTH FILTER AND SEARCH

        $user = request()->get('user');
        $search = request()->query('search', '');
        $day = request()->query('day', '');
        // if there is a valid day is provided then filter by that day and search term
        if(in_array($day, ['saturday','sunday','monday','tuesday','wednesday','thursday','friday'])){
            $customers = Customer::where('is_deleted', false)
                ->where('collection_day', $day)
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('phone_number', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('nid_number', 'like', '%' . $search . '%')
                        ->orWhere('fathers_name', 'like', '%' . $search . '%')
                        ->orWhere('mothers_name', 'like', '%' . $search . '%')
                        // ->orWhere('collection_day', 'like', '%' . $search . '%')
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
        // fetch the total number of not deleted customers
        $totalCustomers = Customer::where('is_deleted', false)->count();
        return Inertia::render('Employee/Products/AllCustomers', [
            'customers' => $customers,
            
            'totalCustomers' => $totalCustomers,
        ]);
        } else {
            $customers = Customer::where('is_deleted', false)
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('phone_number', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('nid_number', 'like', '%' . $search . '%')    
                        ->orWhere('id', 'like', '%' . $search . '%')
                        ->orWhere('fathers_name', 'like', '%' . $search . '%')
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
            $totalCustomers = Customer::where('is_deleted', false)->count();

            return Inertia::render('Employee/Products/AllCustomers', [
                'customers' => $customers,
                
                'totalCustomers' => $totalCustomers,
            ]);
        }
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
        return Inertia::render('Employee/Products/PaidToday', [
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
        return Inertia::render('Employee/Products/NotPaidToday', [
            'user' => $user,
            'customers' => $customers, 
            'totalCustomers' => count($customers)
        ]);
    }
    public function todaysCollection(Request $request){
        $user = $request->get('user');
        

        // $today = $request->input('today');
        $todate = $request->input('todate');
        //find out the day in the format saturday, sunday not from the todate, rahter using the system time and date
        $day = \Carbon\Carbon::now()->format('l');
        
        

        $collections = ProductCustomerMoneyCollection::where('collecting_date', $todate)->get();
        // each collection has a customer_id property and based on this id fetch the customer from customers table and put it to the collection instance as customer property
        $collections->transform(function ($collection) {
            $customer = Customer::find($collection->customer_id);
            $collection->customer = $customer;
            return $collection;
        });

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

        $customer_ids = Customer::where('collection_day', $day)->pluck('id')->toArray();
       
        $customer_products = CustomerProduct::whereIn('customer_id', $customer_ids)
            ->where('is_deleted', false)
            ->where('remaining_payable_price', '>', 0)
            ->get();
        
        $total_receivable_amount = $customer_products->sum('weekly_payable_price');

        return Inertia::render('Employee/Products/TodaysCollection', [
            'totalReceivableAmount' => $total_receivable_amount,  
            'total_collected_amount' => $total_collected_amount,
            'collections' => $collections
        ]);
    }

    public function todaysStatus(){
        $user = request()->get('user');
        $todate = request()->query('todate');

        return Inertia::render('Employee/Products/TodaysStatus', [
            'user' => $user,
            'todate' => $todate
        ]);
    }

    public function customerDetails($id){
        $user = request()->get('user');
        $customer = Customer::findOrFail($id);
        $purchases = CustomerProduct::where('customer_id', $customer->id)
            ->where('is_deleted', false)
            ->get();
        $collections = ProductCustomerMoneyCollection::where('customer_id', $customer->id)->orderBy('created_at', 'desc')
            ->get();
        
        $purchases->transform(function ($purchase) {
            $product = Product::find($purchase->product_id);
            $purchase->product = $product;
            return $purchase;
        });
       

        return Inertia::render('Employee/Products/EmployeeCustomerDetails', [
            'user' => $user,
            'customer' => $customer, 
            'purchases' => $purchases,
            'collections' => $collections
        ]);
    }

    
}