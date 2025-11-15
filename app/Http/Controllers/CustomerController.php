<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
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
        $customers = Customer::where('is_deleted', false)->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/Customers/ShowAllCustomers', [
            'customers' => $customers,
            'user' => $user,
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
        

        return Inertia::render('Admin/Customers/ShowCustomerDetails', [
            'user' => $leanUser,
            'customer' => $customer,
            'purchagesLists' => $purchagesLists,
            
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
    public function destroy(Customer $customer)
    {
        //
    }
}
