<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Loan;
use App\Models\Bank\Member;
use App\Models\Bank\MemberUpdateLog;
use App\Models\Withdraw;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $members = Member::where('is_deleted', false)->orderBy('id', 'desc')->get();
        return Inertia::render('Admin/Bank/BankAllMembers', [
            'members' => $members,
        ]);
    }
    public function allDepositingMembers(){
        return Inertia::render('Admin/Bank/AllDepositingMembers');
    }
    public function allLoanMembers(){
        return Inertia::render('Admin/Bank/AllLoanerMembers');
    }

    public function depositedToday(){
        return Inertia::render('Admin/Bank/DepositedTodayMembers');
    }

    public function providedInstallmentToday(){
        return Inertia::render('Admin/Bank/InstallmentedTodayMembers');
    }
    public function notDepositedToday(){
        return Inertia::render('Admin/Bank/NotDepositedTodayMembers');
    }
    public function notInstallmentedToday(){
        return Inertia::render('Admin/Bank/NotInstallmentedTodayMembers');
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
        // dd($today_date->modify('+115 days'));
        // 

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
        
       
        $has_loan = Loan::where('member_id', $member->id)->where('is_deleted', false)->where('remaining_payable_amount', '>', 0)->exists();
        $deposit_account = Deposit::where('member_id', $member->id)->where('is_deleted', false)->where('last_depositing_predictable_date' , '>', now())->first();

        // details of deposit account if exists
        $deposit_account_id = $deposit_account ? $deposit_account->id : null;
        $daily_deposit_collections = DepositCollection::where('deposit_id', $deposit_account_id)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        $total_deposited_amount =  0;
        foreach($daily_deposit_collections as $collection){
            $total_deposited_amount += $collection->amount;
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

        $member_update_log->name_after_update = $validated['name'];
        $member_update_log->address_after_update = $validated['address'];
        $member_update_log->nid_number_after_update = $validated['nid_number'];
        $member_update_log->fathers_name_after_update = $validated['fathers_name'];
        $member_update_log->mothers_name_after_update = $validated['mothers_name'];
        $member_update_log->updating_user_id = Auth::id();

        $member_update_log->save();
        // update the member with the validated data
        $member->name = $validated['name'];
        $member->address = $validated['address'];
        $member->nid_number = $validated['nid_number'];
        $member->fathers_name = $validated['fathers_name'];
        $member->mothers_name = $validated['mothers_name'];
        $member->admission_fee = $member->admission_fee * 100;

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
}
