<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Member;
use Illuminate\Http\Request;
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
            'address' => 'required|string|max:500',
            'nid_number' => 'required|string|max:255|unique:members,nid_number',
            'fathers_name' => 'required|string|max:255',
            'mothers_name' => 'required|string|max:255',
            'admission_fee' => 'required|numeric|min:0',
        ]);

        // have to crate an instance of member model withe the validated data and also some more inforation with default values. The fields are named: total_loan = 0, total_deposit = 0, and is_deleted = false
        $member = new Member();
        $member->name = $validated['name'];
        $member->address = $validated['address'];
        $member->nid_number = $validated['nid_number'];
        $member->fathers_name = $validated['fathers_name'];
        $member->mothers_name = $validated['mothers_name'];
        $member->admission_fee = $validated['admission_fee'];
        $member->total_loan = 0;    
        $member->total_deposit = 0;
        $member->is_deleted = false;
        $member->save();

        return redirect()->route('admin.bank.members');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        //
    }
}
