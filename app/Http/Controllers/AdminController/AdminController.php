<?php 

namespace App\Http\Controllers\AdminController;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\DepositCollectionUpdateLog;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\LoanCollectionUpdateLog;
use App\Models\Bank\Member;
use App\Models\Cost;
use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductCustomerMoneyCollectionUpdateLog;
use App\Models\ProductUpdateLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
     public function dashboard(){
        $leanUser = request()->get('user');

        // first feature: total number of customers which are not deleted (DONE)
        $totalCustomers = Customer::where('is_deleted', false)->count();

        // find the date of today in the format yyyy-mm-dd and also make an array of dates for the last 7 days
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $last7Days[] = now()->subDays($i)->format('Y-m-d');
        }

        $collections = ProductCustomerMoneyCollection::whereIn('collecting_date', $last7Days)->select('collecting_date', 'collected_amount', 'collectable_amount')
            ->get();

        
        $groupedCollections = [];
        foreach ($collections as $collection) {
            $date = $collection->collecting_date;
            if (!isset($groupedCollections[$date])) {
                $groupedCollections[$date] = [
                    'collected_amount' => 0,
                    'collectable_amount' => 0
                ];
            }
            $groupedCollections[$date]['collected_amount'] += $collection->collected_amount;
            $groupedCollections[$date]['collectable_amount'] += $collection->collectable_amount;
        }

        $purchases = CustomerProduct::with('product')->where('is_deleted', false)->select('id', 'product_id', 'quantity', 'total_payable_price', 'remaining_payable_price')
            ->get();
        foreach ($purchases as $purchase) {
            $purchase->product_name = $purchase->product ? $purchase->product->name : 'Unknown Product';
        }
      

        // from the purchases collection, find the total purchased quantity, total payable price and total remaining payable price grouped by product_id
        $groupedPurchases = [];
        foreach ($purchases as $purchase) {
            $productId = $purchase->product_id;
            if (!isset($groupedPurchases[$productId])) {
                $groupedPurchases[$productId] = [
                    'product_name' => $purchase->product_name,
                    'total_quantity' => 0,
                    'total_payable_price' => 0,
                    'total_remaining_payable_price' => 0
                ];
            }
            $groupedPurchases[$productId]['total_quantity'] += $purchase->quantity;
            $groupedPurchases[$productId]['total_payable_price'] += $purchase->total_payable_price;
            $groupedPurchases[$productId]['total_remaining_payable_price'] += $purchase->remaining_payable_price;
        }

        $stock_products_total_price = Product::where('is_deleted', false)->where('is_available', true)->get()->reduce(function ($carry, $product) {
            return $carry + ($product->current_quantity * $product->buying_price_per_product);
        }, 0);

        // sold products total price
        $sales = CustomerProduct::where('is_deleted', false)->where('remaining_payable_price', '>', 0)->get();
       
        $sold_products_total_price = 0;
        foreach ($sales as $sale) {
            $sold_products_total_price += $sale->total_payable_price;
        }

        $remaining_purchases_ids = $sales->pluck('id')->toArray();
        
        $total_collected_amount = ProductCustomerMoneyCollection::whereIn('customer_products_id', $remaining_purchases_ids)->sum('collected_amount');

        $total_downpayment_amount = CustomerProduct::where('remaining_payable_price', '>', 0)->get()->sum('downpayment');

        // BANK sections
        $members = Member::where('is_deleted', false)->get();
        $total_members = $members->count();

        $deposit_account_count = Deposit::where('is_deleted', false)->count();
        $loan_account_count = Loan::where('is_deleted', false)->count();

        
        $total_deposit_amount = $members->sum('total_deposit');
        
        $total_loaned_amount = Loan::where('is_deleted', false)->sum('total_loan');
        $active_total_loaned_amount = Member::where('is_deleted', false)->where('total_loan', '>', 0)->sum('total_loan');


        $active_loan_ids = Loan::where('is_deleted', false)->where(function ($query) {
            $query->where('remaining_payable_main', '>', 0)
                  ->orWhere('remaining_payable_interest', '>', 0);
        })->pluck('id')->toArray();

        $loan_collections = LoanCollection::whereIn('loan_id', $active_loan_ids)->get();
        $total_collection_for_loan = $loan_collections->sum('paid_amount');
        $total_interest_paid_for_loan = $loan_collections->sum('interest_paid_amount');
        $total_main_paid_for_loan = $loan_collections->sum('main_paid_amount');


        $loans = Loan::whereIn('id', $active_loan_ids)->get();
        $total_remaining_payable_main = $loans->sum('remaining_payable_main');
        $total_remaining_payable_interest = $loans->sum('remaining_payable_interest');
        
        // generate me a list of last seven days as a datetime object keeping only the date part
        $lastSevenDays = collect();
        for ($i = 6; $i >= 0; $i--) {
            $lastSevenDays->push(\Carbon\Carbon::now()->subDays($i)->startOfDay());
        }
        // dd($lastSevenDays);
        $date_wise_loan_and_deposit_collections = [];
        
        foreach ($lastSevenDays as $key => $date) {
            $deposit_collections_sum = DepositCollection::whereDate('created_at', $date)->where('is_deleted', false)->sum('deposit_amount');
            $loan_collections_sum = LoanCollection::whereDate('created_at', $date)->where('is_deleted', false)->sum('paid_amount');
            $date_wise_loan_and_deposit_collections[$key] = [
                'date' => $date->format('Y-m-d'),
                'deposit_collections' => $deposit_collections_sum,
                'loan_collections' => $loan_collections_sum,
            ];
        }

        $total_cost = Cost::where('is_deleted', false)->sum('amount');

        $total_adminssion_fee = Member::sum('admission_fee');
        $total_loan_fee = Loan::sum('loan_fee');
        $active_member_ids = Member::where('is_deleted', false)->pluck('id')->toArray();
        $total_share_money = Loan::whereIn('member_id', $active_member_ids)->sum('share_money');

        // dd($date_wise_loan_and_deposit_collections);

        return Inertia::render('Admin/Dashboard', [
            'user' => $leanUser,
            'totalCustomers' => $totalCustomers, 
            'sevenDayCollections' => $groupedCollections,
            'purchasesSummary' => $groupedPurchases, 
            'stockProductsTotalPrice' => $stock_products_total_price,
            'soldProductsTotalPrice' => $sold_products_total_price,
            'totalCollectedAmount' => $total_collected_amount + $total_downpayment_amount,
            // BANK section data
            'totalMembers' => $total_members,
            'depositAccountCount' => $deposit_account_count,
            'loanAccountCount' => $loan_account_count,
            'totalDepositAmount' => $total_deposit_amount,
            'totalLoanedAmount' => $total_loaned_amount,
            'totalCollectionForLoan' => $total_collection_for_loan,
            'dateWiseLoanAndDepositCollections' => $date_wise_loan_and_deposit_collections,
            'totalInterestPaidForLoan' => $total_interest_paid_for_loan,
            'totalMainPaidForLoan' => $total_main_paid_for_loan,
            'totalRemainingPayableMain' => $total_remaining_payable_main,
            'totalRemainingPayableInterest' => $total_remaining_payable_interest,
            'totalCost' => $total_cost,
            'activeTotalLoanedAmount' => $active_total_loaned_amount,
            'totalAdmissionFee' => $total_adminssion_fee,
            'totalLoanFee' => $total_loan_fee,
            'totalShareMoney' => $total_share_money,
        ]);
    }

    // show all users controller 
    public function showAllUsers(){
        $leanUser = request()->get('user');

        $users = User::where('is_deleted', false)->get();

        return Inertia::render('Admin/Users/AllUsers', [
            'users' => $users,
        ]);
    }

    public function allUsersForBank(){
        $leanUser = request()->get('user');

        $users = User::where('is_deleted', false)->get();

        return Inertia::render('Admin/Bank/BankAllUsers', [
            'users' => $users,
        ]);
    }

    // employee power toggle controller
    public function toggleEmployeePower(Request $request){
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
        
        $user = User::findOrFail($validatedData['user_id']);
        // dd($user);
        // toggle the is_employee field
        if($user->is_admin){
            return redirect()->back()->with('error', 'একজন অ্যাডমিনের এমপ্লয়ী ক্ষমতা পরিবর্তন করা যাবে না।');
        }
        $user->is_activated = !$user->is_activated;
        $user->save();  
        return redirect()->route('admin.showAllUsers');
    }

    public function reportGenerate(){
        return Inertia::render('Admin/Bank/GenerateReport', [
        ]);
    }

    public function employeeWiseCollectionReport(){
        
        
        $validated = request()->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'employee_id' => 'required|exists:users,id',
        ]); 
        

        $employee = User::where('id', $validated['employee_id'])->where('is_deleted', false)->first();

        if(!$employee){
            return redirect()->back()->with('error', 'কর্মচারী পাওয়া যায়নি।');
        }

        $deposit_collections = DepositCollection::with(['update_logs.creator','deposit.member'])->where('collecting_user_id', $employee->id)
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->orderBy('created_at', 'desc')
            ->get();

        $total_deposit_collection = 0;
        
        foreach($deposit_collections as $collection){
            $total_deposit_collection += $collection->deposit_amount;
            $deposit = $collection->deposit;
            $member = $deposit->member;
            $updates = $collection->update_logs;
            // dd($collection);
            $updates->map(function($update){
                $updating_user = $update->creator;
                $update->updating_user_name = $updating_user ? $updating_user->name : 'Unknown User';
                return $update;
            });
            
            $collection->updates = $updates;
            $collection->member_name = $member->name;
            $collection->member_id = $member->id;
        }

        $loan_collections = LoanCollection::with(['loan.member', 'update_logs.creator'])->where('collecting_user_id', $employee->id)
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $total_loan_collection = 0;
        foreach($loan_collections as $collection){
            $total_loan_collection += $collection->paid_amount;
            $loan = $collection->loan;
            $member = $loan->member;
            $updates = $collection->update_logs;
            $updates->map(function($update){
                $updating_user = $update->creator;
                $update->updating_user_name = $updating_user ? $updating_user->name : 'Unknown User';
                return $update;
            });
            $collection->updates = $updates;
            $collection->member_name = $member->name;
            $collection->member_id = $member->id;
        }

        return Inertia::render('Admin/Bank/EmployeeWiseReport', [
            'employee' => $employee,
            'deposit_collections' => $deposit_collections,
            'total_deposit_collection' => $total_deposit_collection,
            'loan_collections' => $loan_collections,
            'total_loan_collection' => $total_loan_collection,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);
    }

    public function employeeWiseProductReportsPage(){
        $employees = User::where('is_employee', true)->where('is_deleted', false)->get();
        return Inertia::render('Admin/Products/ProductEmployeeWiseReport', [
            'employees' => $employees,
        ]);
    }

    public function reportGenerationPage(){
        
        return Inertia::render('Admin/Products/ProductReport', [
            
        ]);
    }

    public function productEmployeeWiseCollectionPage(Request $request){
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'employee_id' => 'nullable|exists:users,id',
        ]);
        $employee = User::where('id', $validated['employee_id'])->where('is_deleted', false)->first();

        $collections = ProductCustomerMoneyCollection::with(['customer','update_logs.creator'])->where('collecting_user_id', $employee->id)
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->orderBy('created_at', 'desc')
            ->get();

        $total_collection = 0;
        $total_collectable = 0;

        foreach($collections as $collection){
            $total_collection += $collection->collected_amount;
            $total_collectable += $collection->collectable_amount;
            $customer = $collection->customer;
            $collection->customer_name = $customer ? $customer->name : 'Unknown Customer';

            $updates = $collection->update_logs;
            $updates->map(function($update){
                $updating_user = $update->creator;
                $update->updating_user_name = $updating_user ? $updating_user->name : 'Unknown User';
                return $update;
            });
            $collection->updates = $updates;
        }

        return Inertia::render('Admin/Products/ProductEmployeeWiseCollection', [
            'employee' => $employee,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'collections' => $collections,
            'total_collection' => $total_collection,
            'total_collectable' => $total_collectable,
        ]);
    }

    public function createReportPage(){
        return Inertia::render('Admin/CreateReport', [
        ]);
    }
   
}
