<?php 

namespace App\Http\Controllers\EmployeeController;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductCustomerMoneyCollectionUpdateLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
                ->orWhere('phone_number',  $search )
                ->orWhere('address', 'like', '%' . $search . '%')
                ->orWhere('nid_number', $search )
                ->orWhere('fathers_name', 'like', '%' . $search . '%')
                ->orWhere('mothers_name', 'like', '%' . $search . '%')
                ->orWhere('id',$search);
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
                        ->orWhere('phone_number',  $search )
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('nid_number', $search )
                        ->orWhere('fathers_name', 'like', '%' . $search . '%')
                        ->orWhere('mothers_name', 'like', '%' . $search . '%')
                        // ->orWhere('collection_day', 'like', '%' . $search . '%')
                        ->orWhere('id',$search);
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
                        ->orWhere('phone_number',  $search )
                        ->orWhere('address', 'like', '%' . $search . '%')
                        ->orWhere('nid_number', $search )    
                        ->orWhere('id', $search)
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
                    ->orWhere('phone_number',  $search )
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhere('nid_number', $search )
                    ->orWhere('fathers_name', 'like', '%' . $search . '%')
                    ->orWhere('id', $search)
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
                    ->orWhere('phone_number',  $search )
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhere('nid_number', $search )
                    ->orWhere('fathers_name', 'like', '%' . $search . '%')
                    ->orWhere('id', $search)
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

    // BANK PART
    public function allBankMembers(){
        $user = request()->get('user');
        $search = request()->query('search', '');

        $members = Member::where('is_deleted', false)
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('phone_number',$search)
                    ->orWhere('nid_number',$search)
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhere('fathers_name', 'like', '%' . $search . '%')
                    ->orWhere('mothers_name', 'like', '%' . $search . '%')
                    ->orWhere('id', $search);
            })
            ->orderBy('id', 'desc')
            ->paginate(10);

        // from all the members search into the deposits table to see if the member has a deposit account, if yes then attach the deposit account to the member instance as deposit_account property
        $members->getCollection()->transform(function ($member) {
            $deposit_account = Deposit::where('member_id', $member->id)
                ->where('is_deleted', false)
                ->first();
            $loan_acount = Loan::where('member_id', $member->id)
                ->where('is_deleted', false)
                ->first();
            $member->deposit_account = $deposit_account;
            $member->loan_account = $loan_acount;
            return $member;
        });

        $totalMembers = User::where('is_deleted', false)
            ->count();

        return Inertia::render('Employee/Bank/EmployeeAllMembers', [
            'members' => $members,
            'totalMembers' => $totalMembers
        ]);
    }

    public function depositAndLoanCollection( $deposit,  $loan){
        
        $sendable_deposit = Deposit::find($deposit);
        $sendable_loan = Loan::find($loan);
        $member = null;
        if($sendable_deposit){
            $member = Member::find($sendable_deposit->member_id);
        } elseif($sendable_loan){
            $member = Member::find($sendable_loan->member_id);
        }
        return Inertia::render('Employee/Bank/EmployeeDepositAndLoanCollection', [
            'deposit' => $sendable_deposit,
            'loan' => $sendable_loan,
            'member' => $member
        ]);
    }

    public function processDepositAndLoanCollection(Request $request){
        $validated = $request->validate([
            'has_deposit' => 'required|boolean',
            'has_loan' => 'required|boolean',
            'deposit_id' => 'nullable|exists:deposits,id',
            'loan_id' => 'nullable|exists:loans,id',
            'deposit_amount' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
        ]);
        $member = null;
        if($validated['deposit_id'] != null){
            $deposit = Deposit::find($validated['deposit_id']);
            $member = Member::find($deposit->member_id);
        }
        else if($validated['loan_id'] != null){
            $loan = Loan::find($validated['loan_id']);
            $member = Member::find($loan->member_id);
        }
        if($member == null){
            return redirect()->back()->withErrors(['general' => 'কোনো বৈধ সদস্য পাওয়া যায়নি।'])->withInput();
        }

        $today = now()->format('Y-m-d');

        if($validated['loan_id'] != null){
            $loan = Loan::findOrFail($validated['loan_id']);
            if ($validated['paid_amount'] * 100 > $loan->remaining_payable_amount) {
                return redirect()->back()->withErrors(['paid_amount' => 'যত টাকা বাকি আছে তার থেকে বেশি পরিশোধ করতে পারবেন না। '])->withInput();
            }

            
            $existing_collection = LoanCollection::where('loan_id', $validated['loan_id'])
                ->where('paying_date', $today)
                ->where('is_deleted', false)
                ->first();
            if ($existing_collection) {
                return redirect()->back()->withErrors(['paid_amount' => 'এই ঋণের জন্য আজকের তারিখে একটি কিস্তি ইতিমধ্যেই সংগ্রহ করা হয়েছে।']);
            } 
        }

        if($validated['deposit_id'] != null){
            $deposit = Deposit::findOrFail($validated['deposit_id']);
            $existing_deposit_collection = DepositCollection::where('deposit_id', $validated['deposit_id'])
                ->where('deposit_date', $today)
                ->where('is_deleted', false)
                ->first();
            if ($existing_deposit_collection) {
                return redirect()->back()->withErrors(['deposit_amount' => 'এই সদস্যের জন্য আজকের তারিখে একটি সঞ্চয় ইতিমধ্যেই সংগ্রহ করা হয়েছে।']);
            }
        }
        
        DB::transaction(function () use ($validated){
            if($validated['deposit_id'] != null){
                $deposit = Deposit::find($validated['deposit_id']);
                // create a deposit_collections record
                $deposit_collection = new DepositCollection();

                $deposit_collection->deposit_id = $validated['deposit_id'];
                $deposit_collection->collecting_user_id = Auth::id();
                $deposit_collection->deposit_amount = $validated['deposit_amount'] * 100; // store in cents
                $deposit_collection->deposit_date = now()->format('Y-m-d');
                $deposit_collection->is_deleted = false;
                $deposit_collection->depositable_amount = $deposit->daily_deposit_amount;
                $deposit_collection->save();
                // find the member from the deposit_id
                
                $member = Member::find($deposit->member_id);
                $member->total_deposit += $validated['deposit_amount'] * 100;
                $member->save();
            }

            if($validated['loan_id'] != null){
                $loan = Loan::find($validated['loan_id']);
                 // create a loan_collections record
                $loan_collection = new LoanCollection();
                $loan_collection->loan_id = $validated['loan_id'];
                $loan_collection->collecting_user_id = Auth::id();
                $loan_collection->paid_amount = $validated['paid_amount'] * 100; // store in cents
                $loan_collection->paying_date = now()->format('Y-m-d');
                $loan_collection->is_deleted = false;
                $loan_collection->save();

                // update the loan's remaining_payable_amount
                // $loan = Loan::find($validated['loan_id']);
                $loan->remaining_payable_amount -= $validated['paid_amount'] * 100;
                $loan->save();
            }
            
       });
        
        return redirect()->route('employee.bank.member_details',[
            'member' => $member->id
        ] )->with('success', 'সফলভাবে সঞ্চয় ও/অথবা কিস্তি সংগ্রহ সম্পন্ন হয়েছে।');
    }

    
}