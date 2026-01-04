<?php

namespace App\Http\Controllers;

use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Loan;
use App\Models\Bank\Member;
use App\Models\DepositDismissal;
use App\Models\Withdraw;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class DepositDismissalController extends Controller
{
    public function depositDismissalForm(Deposit $deposit){
        $member = Member::findOrFail($deposit->member_id);

        $daily_deposit_amount = $deposit->daily_deposit_amount;

        // find the number of days within $deposit_account_creation_date$ and $last_depositing_date using Carbon
        $creation_date = Carbon::parse($deposit->created_at)->startOfDay();
        $last_date = Carbon::parse($deposit->last_depositing_predictable_date)->startOfDay();

        $total_days = $creation_date->diffInDays($last_date) + 1; // +1 to include the last day
        $total_number_of_deposits = DepositCollection::where('deposit_id', $deposit->id)
            ->where('is_deleted', false)
            ->count();

        $total_day_missed = $total_days - $total_number_of_deposits ;

        $today = Carbon::now()->startOfDay();
        if($today <= $last_date){
            // calculate the number of days between creation_date and today
            $total_days_until_today = $creation_date->diffInDays($today) + 1;
            $total_day_missed = $total_days_until_today - $total_number_of_deposits;
        }

        $total_withdraw_amount = Withdraw::where('deposit_id', $deposit->id)
            ->where('is_deleted', false)
            ->sum('withdraw_amount');
        $total_withdraw_times = Withdraw::where('deposit_id', $deposit->id)
            ->where('is_deleted', false)
            ->count();

        $all_deposit_collections = DepositCollection::where('deposit_id', $deposit->id)
            ->where('is_deleted', false)
            ->get();
        $total_collected_amount_withing_range = 0;
        $lower_amount_days_count_than_promised = 0;
        $higher_amount_days_count_than_promised = 0;
        
        foreach($all_deposit_collections as $collection){
            if($collection->deposit_amount > $daily_deposit_amount){
                $higher_amount_days_count_than_promised += 1;
            } else if($collection->deposit_amount < $daily_deposit_amount){
                $lower_amount_days_count_than_promised += 1;
            }
            if($collection->deposit_amount <= $daily_deposit_amount){
                $total_collected_amount_withing_range += $collection->deposit_amount;
            } else{
                $total_collected_amount_withing_range += $daily_deposit_amount;
            }
        }

        // dd($total_day_missed);

        return Inertia::render('Admin/Bank/DismissDepositAccount', [
            'member' => $member,
            'deposit' => $deposit,
            'total_day_missed' => $total_day_missed,
            'total_withdraw_amount' => $total_withdraw_amount,
            'total_withdraw_times' => $total_withdraw_times,
            'total_collected_amount_withing_range' => $total_collected_amount_withing_range, 
            'lower_amount_days_count_than_promised' => $lower_amount_days_count_than_promised,
            'higher_amount_days_count_than_promised' => $higher_amount_days_count_than_promised
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'deposit_id' => 'required|exists:deposits,id',
            'total_remaining_deposit' => 'required|numeric|min:1',
            'total_paid' => 'required|numeric|min:1',
        ]);

        $deposit = Deposit::findOrFail($validated['deposit_id']);
        $member = Member::findOrFail($deposit->member_id);

        $last_depositing_prdictable_date = Carbon::parse($deposit->last_depositing_predictable_date)->startOfDay();
        $today_date = Carbon::now()->startOfDay();

        // if($today_date->lt($last_depositing_prdictable_date)){
        //     return back()->withErrors(['message' => 'সদস্যের সঞ্চয় একাউন্ট বন্ধ করার জন্য সর্বনিম্ন পূর্বনির্ধারিত জমাদানের তারিখ অতিক্রম করতে হবে।']);
        // }
        
        if($member->total_loan > 0){
            return back()->withErrors(['message' => 'সদস্যের উপর বকেয়া ঋণ থাকায় সঞ্চয় একাউন্ট বন্ধ করা যাবে না।']);
        }

        // $loan = Loan::where('member_id', $member->id)
        //     ->where('is_deleted', false)
        //     ->first();
        
        // if($loan){
        //     return back()->withErrors(['message' => 'সদস্যের উপর বকেয়া ঋণ থাকায় সঞ্চয় একাউন্ট বন্ধ করা যাবে না।']);
        // }

        $total_deposit_collection = DepositCollection::where('deposit_id', $deposit->id)
            ->where('is_deleted', false)
            ->sum('deposit_amount');
       
       DB::transaction(function () use ($deposit, $validated, $member, $total_deposit_collection) {
           $deposit->is_deleted = true;
           $deposit->save();

           $member->total_deposit = 0;
           $member->save();

                DepositDismissal::create([
                'deposit_id' => $deposit->id,
                'total_remaining_deposit' => $validated['total_remaining_deposit'] * 100,
                'total_paid' => $validated['total_paid'] * 100,
                'creating_user_id' => Auth::id(),
                'total_collected_deposit' => $total_deposit_collection,
              ]);
        });

        return redirect()->route('admin.bank.member_details', ['member' => $member->id])
            ->with('success', 'সঞ্চয় একাউন্ট সফলভাবে বন্ধ করা হয়েছে এবং বাকি টাকা সদস্যকে প্রদান করা হয়েছে।');

    }
}
