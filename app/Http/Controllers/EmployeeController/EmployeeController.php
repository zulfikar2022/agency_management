<?php 

namespace App\Http\Controllers\EmployeeController;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\User;
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

    return Inertia::render('Employee/Products/HaveToPayToday', [
        'user' => $user,
        'customers' => $customers
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

        return Inertia::render('Employee/Products/AllCustomers', [
            'customers' => $customers,
            'user' => $user,
        ]);
        } else {
            $customers = Customer::where('is_deleted', false)
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('phone_number', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('nid_number', 'like', '%' . $search . '%')    

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

            return Inertia::render('Employee/Products/AllCustomers', [
                'customers' => $customers
        ]);
        
        }
    }

    public function customersPaidToday(){
        $user = request()->get('user');
        $today = request()->query('todate');
        $search = request()->query('search', '');

        // make the following arraay unique
        
        $customersIds = ProductCustomerMoneyCollection::where('created_at', $today)
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

        return Inertia::render('Employee/Products/PaidToday', [
            'user' => $user,
            'customers' => $customers
        ]);
    }

    public function customersDidNotPayToday(){
        $user = request()->get('user');
        $todate = request()->query('todate');
        $today =  request()->query('today');
        $search = request()->query('search', '');

        $customersIds = ProductCustomerMoneyCollection::where('created_at', $todate)
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

        return Inertia::render('Employee/Products/NotPaidToday', [
            'user' => $user,
            'customers' => $customers
        ]);
    }

    public function todaysCollection(){
        $user = request()->get('user');
        $todate = request()->query('todate');

        return Inertia::render('Employee/Products/TodaysCollection', [
            'user' => $user,
            'todate' => $todate
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
}