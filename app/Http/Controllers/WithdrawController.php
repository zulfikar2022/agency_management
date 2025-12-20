<?php

namespace App\Http\Controllers;

use App\Models\Bank\Deposit;
use App\Models\Bank\Member;
use App\Models\Withdraw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function Symfony\Component\Clock\now;

class WithdrawController extends Controller
{

    public function withdrawMoney(Member $member)
    {
        $today = now()->format('Y-m-d');
        $deposit = Deposit::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where('last_depositing_predictable_date', '>=', $today)
            ->first();
        $deposit_id = $deposit ? $deposit->id : null;

        return Inertia::render('Admin/Bank/WithdrawMoney', [
            'member' => $member,
            'deposit_id' => $deposit_id,
        ]);
    }
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
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'deposit_id' => 'required|exists:deposits,id',
            'withdraw_amount' => 'required|numeric|min:1',
        ]);

        $deposit = Deposit::find($validated['deposit_id']);
        $member = Member::find($deposit->member_id);
        $total_deposit_cents = $member->total_deposit;

        if($validated['withdraw_amount'] * 100 > $total_deposit_cents){
            return back()->withErrors(['withdraw_amount' => 'যতটাকা আছে তার থেকে বেশি টাকা উত্তোলন করা যাবে না।']);
        }

        $withdraw = new Withdraw();
        $withdraw->deposit_id = $validated['deposit_id'];
        $withdraw->withdrawing_user_id = Auth::id();
        $withdraw->withdraw_amount = $validated['withdraw_amount'] * 100; // store in cents
        $withdraw->save();

        // update the member's total deposit
        $member->total_deposit = $total_deposit_cents - ($validated['withdraw_amount'] * 100);
        $member->save();

        return redirect()->route('admin.bank.member_details', ['member' => $member->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Withdraw $withdraw)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Withdraw $withdraw)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Withdraw $withdraw)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Withdraw $withdraw)
    {
        //
    }
}
