<?php

namespace App\Http\Controllers;

use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Member;
use App\Models\DepositDismissal;
use App\Models\Withdraw;
use Carbon\Carbon;
use Illuminate\Http\Request;
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

        $total_day_missed = $total_days - $total_number_of_deposits;

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
}
