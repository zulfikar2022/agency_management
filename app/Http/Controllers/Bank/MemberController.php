<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use App\Models\Bank\MemberUpdateLog;
use App\Models\Withdraw;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->query('search', '');
        


        $members = Member::where('is_deleted', false)
        ->where(function($query) use ($search) {
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('phone_number',$search)
                  ->orWhere('nid_number',  $search)
                  ->orWhere('id', $search)
                  ->orWhere('address', 'like', '%'.$search.'%')
                  ->orWhere('fathers_name', 'like', '%'.$search.'%')
                  ->orWhere('mothers_name', 'like', '%'.$search.'%');
        })
        ->orderBy('id', 'desc')->paginate(50)->withQueryString();
        return Inertia::render('Admin/Bank/BankAllMembers', [
            'data' => $members,
        ]);
    }
    public function allDepositingMembers(){
        $search = request()->query('search', '');
        $today = now()->format('Y-m-d');
        $deposits = Deposit::where('is_deleted', false)
            ->where('last_depositing_predictable_date', '>=', $today)
            ->pluck('member_id');
        $members = Member::whereIn('id', $deposits)
        ->where(function($query) use ($search) {
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('phone_number',$search)
                  ->orWhere('nid_number',  $search)
                  ->orWhere('id', $search)
                  ->orWhere('address', 'like', '%'.$search.'%')
                  ->orWhere('fathers_name', 'like', '%'.$search.'%')
                  ->orWhere('mothers_name', 'like', '%'.$search.'%');
        })
        ->where('is_deleted', false)
        ->orderBy('created_at', 'desc')->paginate(50)->withQueryString();

        return Inertia::render('Admin/Bank/AllDepositingMembers', [
            'data' => $members,
        ]);
    }
    public function allLoanMembers(){
        $search = request()->query('search', '');
        $loans = Loan::where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->pluck('member_id');

        $members = Member::whereIn('id', $loans)
        ->where(function($query) use ($search) {
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('phone_number',$search)
                  ->orWhere('nid_number',  $search)
                  ->orWhere('id', $search)
                  ->orWhere('address', 'like', '%'.$search.'%')
                  ->orWhere('fathers_name', 'like', '%'.$search.'%')
                  ->orWhere('mothers_name', 'like', '%'.$search.'%');
        })
        ->where('is_deleted', false)
        ->orderBy('created_at', 'desc')->paginate(50)->withQueryString();
        return Inertia::render('Admin/Bank/AllLoanerMembers', [
            'data' => $members,
        ]);
    }

    public function depositedToday(){
        $search = request()->query('search', '');
        $today = now()->format('Y-m-d');
        $deposit_collections = DepositCollection::where('is_deleted', false)
            ->whereDate('created_at', $today)
            ->pluck('deposit_id');
        $deposits = Deposit::whereIn('id', $deposit_collections)
            ->where('is_deleted', false)
            ->pluck('member_id');
        $members = Member::whereIn('id', $deposits)
        ->where(function($query) use ($search) {
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('phone_number',$search)
                  ->orWhere('nid_number',  $search)
                  ->orWhere('id', $search)
                  ->orWhere('address', 'like', '%'.$search.'%')
                  ->orWhere('fathers_name', 'like', '%'.$search.'%')    
                  ->orWhere('mothers_name', 'like', '%'.$search.'%');
        })
        ->where('is_deleted', false)
        ->orderBy('created_at', 'desc')->paginate(50)->withQueryString();
        return Inertia::render('Admin/Bank/DepositedTodayMembers', [
            'data' => $members,
        ]);
    }

    public function providedInstallmentToday(){
        $search = request()->query('search', '');
        $today = now()->format('Y-m-d');
        $loan_collections = LoanCollection::where('is_deleted', false)
            ->whereDate('created_at', $today)
            ->pluck('loan_id');
        $loans = Loan::whereIn('id', $loan_collections)
            ->where('is_deleted', false)
            ->pluck('member_id');
        $members = Member::whereIn('id', $loans)
        ->where(function($query) use ($search) {
            $query->where('name', 'like', '%'.$search.'%')
                  ->orWhere('phone_number',$search)
                  ->orWhere('nid_number',  $search)
                  ->orWhere('id', $search)
                  ->orWhere('address', 'like', '%'.$search.'%')
                  ->orWhere('fathers_name', 'like', '%'.$search.'%')    
                  ->orWhere('mothers_name', 'like', '%'.$search.'%');
        })
        ->where('is_deleted', false)
        ->orderBy('created_at', 'desc')->paginate(50)->withQueryString();
        return Inertia::render('Admin/Bank/InstallmentedTodayMembers', [
            'data' => $members,
        ]);
    }
    public function notDepositedToday(){
        $today = now()->format('Y-m-d');
        $deposits = Deposit::where('is_deleted', false)
            ->where('last_depositing_predictable_date', '>=', $today)->get();
        $member_ids = $deposits->pluck(value: 'member_id')->toArray();
        
        $deposited_member_ids = DepositCollection::whereDate('created_at', $today)
            ->where('is_deleted', false)
            // ->whereIn('deposit_id', $deposits->pluck('id'))
            ->pluck('deposit_id')
            ->map(function($deposit_id) use ($deposits){
                return $deposits->firstWhere('id', $deposit_id)->member_id;
            })->toArray();

        $not_deposited_member_ids = array_diff($member_ids, $deposited_member_ids);
        $not_deposited_members = Member::whereIn('id', $not_deposited_member_ids)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->withQueryString();
        
        return Inertia::render('Admin/Bank/NotDepositedTodayMembers', [
            'data' => $not_deposited_members,
        ]);
    }
    public function notInstallmentedToday(){
        $search = request()->query('search', '');
        $today = now()->format('Y-m-d');

        $loans_id = Loan::where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->where('last_paying_date', '>=', $today)
            ->pluck('id');
        $loan_collection_todays_loan_ids = LoanCollection::where('is_deleted', false)
            ->whereDate('created_at', $today)
            ->pluck('loan_id');
        $not_installmented_loan_ids = $loans_id->diff($loan_collection_todays_loan_ids);

        $members = Member::whereIn('id', function($query) use ($not_installmented_loan_ids) {
                $query->select('member_id')
                      ->from('loans')
                      ->whereIn('id', $not_installmented_loan_ids)
                      ->where('is_deleted', false);
            })
            ->where(function($query) use ($search) {
                $query->where('name', 'like', '%'.$search.'%')
                      ->orWhere('phone_number',$search)
                      ->orWhere('nid_number',  $search)
                      ->orWhere('id', $search)
                      ->orWhere('address', 'like', '%'.$search.'%')
                      ->orWhere('fathers_name', 'like', '%'.$search.'%')    
                      ->orWhere('mothers_name', 'like', '%'.$search.'%');
            })
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Bank/NotInstallmentedTodayMembers', [
            'data' => $members,
        ]);
    }

    public function depositAccount(Member $member){
        return Inertia::render('Admin/Bank/CreateDepositAccount', [
            'member' => $member,
        ]);
    }

    public function createDepositAccount(Request $request, Member $member){
        $validated = $request->validate([
            'daily_deposit_amount' => 'required|numeric|min:1',
        ]);
        
        $today_date = now()->toDate();
        // chekc if there any existing deposit account for the member
        $existing_deposit = Deposit::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->first();
        if($existing_deposit){
            return redirect()->back()->withErrors(['error' => 'ডিপোজিট একাউন্ট ইতিমধ্যে বিদ্যমান।']);
        }

        // create deposit account for the member
        $deposit = new Deposit();
        $deposit->member_id = $member->id;
        $deposit->creating_user_id = Auth::id();
        $deposit->daily_deposit_amount = $validated['daily_deposit_amount'] * 100; // store in cents
        $deposit->last_depositing_predictable_date = $today_date->modify('+1 year');
        $deposit->save();

        return redirect()->route('admin.bank.member_details', ['member' => $member->id]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Bank/AddNewMember');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'nid_number' => 'required|string|max:255|unique:members,nid_number',
            'fathers_name' => 'required|string|max:255',
            'mothers_name' => 'required|string|max:255',
            'admission_fee' => 'required|numeric|min:0',
        ]);

        // have to crate an instance of member model withe the validated data and also some more inforation with default values. The fields are named: total_loan = 0, total_deposit = 0, and is_deleted = false
        $member = new Member();
        $member->name = $validated['name'];
        $member->phone_number = $validated['phone_number'];
        $member->address = $validated['address'];
        $member->nid_number = $validated['nid_number'];
        $member->fathers_name = $validated['fathers_name'];
        $member->mothers_name = $validated['mothers_name'];
        $member->admission_fee = $validated['admission_fee'] * 100; // store in cents
        $member->total_loan = 0;    
        $member->total_deposit = 0;
        $member->is_deleted = false;
        $member->save();

        return redirect()->route( 'admin.bank.members');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        
       
        $loan = Loan::where('member_id', $member->id)->where('is_deleted', false)->where('remaining_payable_amount', '>', 0)->first();
        $has_loan = Loan::where('member_id', $member->id)->where('is_deleted', false)->where('remaining_payable_amount', '>', 0)->exists();
        $deposit_account = Deposit::where('member_id', $member->id)->where('is_deleted', false)->first();

        // dd($deposit_account);

        // details of deposit account if exists
        $deposit_account_id = $deposit_account ? $deposit_account->id : null;
        $daily_deposit_collections = DepositCollection::where('deposit_id', $deposit_account_id)
            ->where('is_deleted', false)
            ->where('deposit_amount', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();
            // dd($daily_deposit_collections);
        $total_deposited_amount =  0;
        foreach($daily_deposit_collections as $collection){
            $total_deposited_amount += $collection->deposit_amount;
        }
        $number_of_deposit_collections = $daily_deposit_collections->count();

        $deposit_account_creating_date = new DateTime($deposit_account?->created_at ?? now());
        $today_date = new DateTime(now());
        $date_diff = $deposit_account_creating_date->diff($today_date);
        $days_difference_of_deposit = $date_diff->days;

        // withdraw details
        $withdraws =  Withdraw::where('deposit_id', $deposit_account?->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $update_history = MemberUpdateLog::where('member_id', $member->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // each instance of member_update_logs has a updating_user_id field. We need to get the name of the user who updated the member information from the users table. 


        $today = Carbon::today();
        $not_paid_days_count = 0;

        if($deposit_account){
          $last_deposit_date = new Carbon($deposit_account->last_depositing_predictable_date);
          if( $last_deposit_date->lessThan($today) ){
            $not_paid_days_count = $last_deposit_date->diffInDays($today) + 1 - $number_of_deposit_collections;
          }else{
                $start_date = Carbon::parse($deposit_account->created_at)->startOfDay();
                $end_date = $today->startOfDay();
                $not_paid_days_count = $start_date->diffInDays($end_date) + 1 - $number_of_deposit_collections;

          }
        }

        
        

        return Inertia::render('Admin/Bank/MemberDetails', [
            'member' => $member,
            'has_deposit_account' => $deposit_account ? true : false,
            'deposit_account' => $deposit_account,
            'total_deposited_amount' => $total_deposited_amount,
            'number_of_deposit_collections' => $number_of_deposit_collections,
            'days_difference_of_deposit' => $days_difference_of_deposit,
            'has_loan' => $has_loan,
            // withdraw information bellow
            'withdraws' => $withdraws,
            'loan' => $loan,
            'update_history' => $update_history,
            'not_paid_days_count' => $not_paid_days_count,
        ]);
    }

    public function memberDetailsForEmployee(Member $member)
    {
        $deposit = Deposit::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where('last_depositing_predictable_date', '>=', now()->format('Y-m-d'))
            ->first();
        $loan = Loan::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->first();
        $loan_collections = LoanCollection::where('loan_id', $loan?->id)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        $deposit_collections = DepositCollection::where('deposit_id', $deposit?->id)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        $total_deposited_amount = 0;

        $withdraws =  Withdraw::where('deposit_id', $deposit?->id)
            ->orderBy('created_at', 'desc')
            ->get();

        foreach($deposit_collections as $collection){
            $total_deposited_amount += $collection->deposit_amount;
        }        
        return Inertia::render('Employee/Bank/EmployeeMemberDetails', [
            'member' => $member,
            'loan' => $loan,
            'total_deposited_amount' => $total_deposited_amount,
            'deposit_collections' => $deposit_collections,
            'loan_collections' => $loan_collections,
            'withdraws' => $withdraws,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member)
    {
        //
        return Inertia::render('Admin/Bank/UpdateMember', [
            'member' => $member,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'nid_number' => 'required|string|max:255|unique:members,nid_number,'.$member->id,
            'fathers_name' => 'required|string|max:255',
            'mothers_name' => 'required|string|max:255',
            'admission_fee' => 'required|numeric|min:0',
            'phone_number' => 'required|string|max:255',
        ]);
        // dd($validated);
        // create an entry to the member_update_logs table 
        $member_update_log = new MemberUpdateLog();
        $member_update_log->member_id = $member->id;
        $member_update_log->name_before_update = $member->name;
        $member_update_log->address_before_update = $member->address;
        $member_update_log->nid_number_before_update = $member->nid_number;
        $member_update_log->fathers_name_before_update = $member->fathers_name;
        $member_update_log->mothers_name_before_update = $member->mothers_name;
        $member_update_log->phone_number_before_update = $member->phone_number;

        $member_update_log->name_after_update = $validated['name'];
        $member_update_log->address_after_update = $validated['address'];
        $member_update_log->nid_number_after_update = $validated['nid_number'];
        $member_update_log->fathers_name_after_update = $validated['fathers_name'];
        $member_update_log->mothers_name_after_update = $validated['mothers_name'];
        $member_update_log->phone_number_after_update = $validated['phone_number'];
        $member_update_log->updating_user_id = Auth::id();

        $member_update_log->save();
        // update the member with the validated data
        $member->name = $validated['name'];
        $member->address = $validated['address'];
        $member->nid_number = $validated['nid_number'];
        $member->fathers_name = $validated['fathers_name'];
        $member->mothers_name = $validated['mothers_name'];
        $member->phone_number = $validated['phone_number'];
        $member->admission_fee = 20 * 100;

        $member->save();
        return redirect()->route('admin.bank.member_details', ['member' => $member->id]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        //
    }

    // REPORT GENERATION FUNCTIONS

    public function generateMemberDetailsReport(Member $member)
    {

        // find the loan and the deposit instance for the member
        $loan = Loan::where('member_id', $member->id)
                ->where('is_deleted', false)
                ->where('remaining_payable_amount', '>', 0)
                ->first();
        $loan_collections = LoanCollection::where('loan_id', $loan?->id)
                ->where('is_deleted', false)
                ->orderBy('created_at', 'desc')
                ->get();
        $deposit = Deposit::where('member_id', $member->id)
                ->where('is_deleted', false)
                // ->where('last_depositing_predictable_date', '>=', now()->format('Y-m-d'))
                ->first();
            
        $deposit_collections = DepositCollection::where('deposit_id', $deposit?->id)
                ->where('is_deleted', false)
                ->orderBy('created_at', 'desc')
                ->get();
        $withdraw_collections =  Withdraw::where('deposit_id', $deposit?->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $html = view('pdf.member-details-report', [
        'member' => $member,
        'loan' => $loan,
        'deposit' => $deposit,
        'loan_collections' => $loan_collections,
        'deposit_collections' => $deposit_collections,
        'withdraw_collections' => $withdraw_collections,
        ])->render();


    $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename = $member->id . '_' . $member->name . '_' . $todayDate.'_member_details_report' . '.pdf';

    return response($pdfData, 200)
    ->header('Content-Type', 'application/pdf')
    ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateMemberDepositReport(Member $member)
    {
        $deposit = Deposit::where('member_id', $member->id)
                ->where('is_deleted', false)
                // ->where('last_depositing_predictable_date', '>=', now()->format('Y-m-d'))
                ->first();
            
        $deposit_collections = DepositCollection::where('deposit_id', $deposit?->id)
                ->where('is_deleted', false)
                ->orderBy('created_at', 'desc')
                ->get();
        $total_deposit_collection = 0;
        foreach($deposit_collections as $collection){
            $total_deposit_collection += $collection->deposit_amount;
        }

        $html = view('pdf.member-deposit-collection-report', [
        'member' => $member,
        'deposit' => $deposit,
        'deposit_collections' => $deposit_collections,
        'total_deposit_collection' => $total_deposit_collection,
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  $member->id . '_' . $member->name . '_' . $todayDate.'_deposit_collection_report' . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateMemberLoanCollectionReport(Member $member)
    {
        $loan = Loan::where('member_id', $member->id)
                ->where('is_deleted', false)
                // ->where('remaining_payable_amount', '>', 0)
                ->first();
        $loan_collections = LoanCollection::where('loan_id', $loan?->id)
                ->where('is_deleted', false)
                ->orderBy('created_at', 'desc')
                ->get();

        $html = view('pdf.member-loan-collection-report', [
            'member' => $member,
            'loan' => $loan,
            'loan_collections' => $loan_collections,
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  $member->id . '_' . $member->name . '_' . $todayDate.'_loan_instalment_collection_report' . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateMemberWithdrawReport(Member $member)
    {
        $deposit = Deposit::where('member_id', $member->id)
                ->where('is_deleted', false)
                ->first();
            
        $withdraws =  Withdraw::where('deposit_id', $deposit?->id)
            ->orderBy('created_at', 'desc')
            ->get();

        
        $total_withdrawn_amount = 0;
        foreach($withdraws as $withdraw){
            $total_withdrawn_amount += $withdraw->withdraw_amount;
        }
        

        $html = view('pdf.member-withdraw-report', [
        'member' => $member,
        'withdraws' => $withdraws,
        'total_withdrawn_amount' => $total_withdrawn_amount,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  $member->id . '_' . $member->name . '_' . $todayDate.'_withdraw_report' . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }
}