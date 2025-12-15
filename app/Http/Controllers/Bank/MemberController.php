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
        
        return Inertia::render('Admin/Bank/BankAllMembers');
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
        //
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
