<?php

namespace App\Http\Controllers;

use App\Models\Bank\Deposit;
use App\Models\Bank\Loan;
use App\Models\Bank\Member;
use App\Models\User;
use App\Models\Withdraw;
use App\Models\WithdrawUpdateLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function withdrawLists(Deposit $deposit){
        $member = Member::find($deposit->member_id);

        $withdraws =  Withdraw::where('deposit_id', $deposit->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $withdraws->transform(function ($item) {
            $updates = WithdrawUpdateLogs::where('withdraw_id', $item->id)->orderBy('created_at', 'desc')->get();
            $updates->transform(function ($update) {
                $updating_user = User::find($update->updating_user_id);
                $update->updating_user_name = $updating_user ? $updating_user->name : 'Unknown';
                return $update;
            });
            $item->updates = $updates;
            return $item;
        });

        return Inertia::render('Admin/Bank/WithdrawLists', [
            'member' => $member,
            'deposit' => $deposit,
            'withdraws' => $withdraws,
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

        $deposit = Deposit::findOrFail($validated['deposit_id']);
        $member = Member::findOrFail($deposit->member_id);
        // find the members loan
        $loan = Loan::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->first();
        $total_deposit_cents = $member->total_deposit;

        if($validated['withdraw_amount'] * 100 > $total_deposit_cents){
            return back()->withErrors(['withdraw_amount' => 'যতটাকা আছে তার থেকে বেশি টাকা উত্তোলন করা যাবে না।']);
        }

        if ($loan) {
            if($member->total_deposit - $validated['withdraw_amount'] * 100 < $loan->safety_money){
                return back()->withErrors(['withdraw_amount' => 'এই উত্তোলনের পর সদস্যের জমা পরিমাণ জামানতের চেয়ে কম হতে পারবে না।']);
            }
        }

        DB::transaction(function() use ($validated, $member, $total_deposit_cents) {
            $withdraw = new Withdraw();
            $withdraw->deposit_id = $validated['deposit_id'];
            $withdraw->withdrawing_user_id = Auth::id();
            $withdraw->withdraw_amount = $validated['withdraw_amount'] * 100; // store in cents
            $withdraw->save();

            // update the member's total deposit
            $member->total_deposit = $total_deposit_cents - ($validated['withdraw_amount'] * 100);
            $member->save();
        });

        

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
        $deposit = Deposit::find($withdraw->deposit_id);
        $member = Member::find($deposit->member_id);
        return Inertia::render('Admin/Bank/WithdrawUpdate', [
            'withdraw' => $withdraw,
            'member' => $member,
            'deposit' => $deposit,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Withdraw $withdraw)
    {
        $validated = $request->validate([
            'withdraw_amount' => 'required|numeric|min:1',
            'withdraw_id' => 'required|exists:withdraws,id',
        ]);

        $withdraw_amount = $validated['withdraw_amount'] * 100; // convert to cents
        $deposit = Deposit::find($withdraw->deposit_id);
        $member = Member::findOrFail($deposit->member_id);

        $total_deposit_before_withdraw = $member->total_deposit + $withdraw->withdraw_amount;

        if($withdraw_amount > $total_deposit_before_withdraw){
            return back()->withErrors(['withdraw_amount' => 'যতটাকা আছে তার থেকে বেশি টাকা উত্তোলন করা যাবে না।']);
        }

        $loan = Loan::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->first();

        if ($loan) {
            if($total_deposit_before_withdraw - $withdraw_amount < $loan->safety_money){
                return back()->withErrors(['withdraw_amount' => 'এই উত্তোলনের পর সদস্যের জমা পরিমাণ জামানতের চেয়ে কম হতে পারবে না।']);
            }
        }

        // create an instance of withdraw_update_logs
        DB::transaction(function() use ($withdraw, $withdraw_amount, $member, $total_deposit_before_withdraw) {
            $withdraw_update_log = new WithdrawUpdateLogs();
            $withdraw_update_log->withdraw_id = $withdraw->id;
            $withdraw_update_log->updating_user_id = Auth::id();
            $withdraw_update_log->withdraw_amount_before_update = $withdraw->withdraw_amount;
            $withdraw_update_log->withdraw_amount_after_update = $withdraw_amount;
            $withdraw_update_log->save();

            // update the withdraw record
            $withdraw->withdraw_amount = $withdraw_amount;
            $withdraw->save();
            // update the member's total deposit
            $member->total_deposit = $total_deposit_before_withdraw - $withdraw_amount;
            $member->save();
        });

        return redirect()->route('admin.bank.withdraw_lists', ['deposit' => $deposit->id]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Withdraw $withdraw)
    {
        //
    }
}
