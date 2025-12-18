<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DepositController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Member $member)
    {
        // dd($member);
        // find the deposit by member id
        $deposit = Deposit::where('member_id', $member->id)
        ->where('is_deleted', false)
        ->where('last_depositing_predictable_date', '>=', now()->format('Y-m-d'))
        ->first();
        return Inertia::render('Employee/Bank/EmployeeCollectDeposit', [
            'member' => $member,
            'deposit' => $deposit,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'deposit_amount' => 'required|numeric|min:0',
            'deposit_id' => 'required|exists:deposits,id',
        ]);

        // find if the deposit exists with depost_id and deposit_date = today
        $existing_deposit = DepositCollection::where('deposit_id', $validated['deposit_id'])
            ->where('deposit_date', now()->format('Y-m-d'))
            ->where('is_deleted', false)
            ->first();
        if ($existing_deposit) {
            return back()->withErrors(['deposit_amount' => 'আজকের তারিখের জন্য এই সঞ্চয় ইতিমধ্যে জমা করা হয়েছে।']);
        }

        // create a deposit record
        $deposit_collection = new DepositCollection();

        $deposit_collection->deposit_id = $validated['deposit_id'];
        $deposit_collection->collecting_user_id = Auth::id();
        $deposit_collection->deposit_amount = $validated['deposit_amount'] * 100; // store in cents
        $deposit_collection->deposit_date = now()->format('Y-m-d');
        $deposit_collection->is_deleted = false;
        $deposit_collection->save();
        return redirect()->route('employee.bank.members')->with('success', 'সঞ্চয় সফলভাবে জমা করা হয়েছে।');

    }

    /**
     * Display the specified resource.
     */
    public function show(Deposit $deposit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deposit $deposit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Deposit $deposit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deposit $deposit)
    {
        //
    }
}
