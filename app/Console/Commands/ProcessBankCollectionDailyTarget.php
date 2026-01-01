<?php

namespace App\Console\Commands;

use App\Models\Bank\Deposit;
use App\Models\Bank\Loan;
use App\Models\BankCollectionDailyTarget;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessBankCollectionDailyTarget extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-bank-collection-daily-target';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $total_daily_deposit_amount = Deposit::where('is_deleted', false)
                    ->where('last_depositing_predictable_date', '<=', Carbon::today())
                    ->sum('daily_deposit_amount');
        $loans = Loan::where('is_deleted', false)
                    ->where(function ($query) {
                    $query->where('remaining_payable_main', '>', 0)
                          ->orWhere('remaining_payable_interest', '>', 0);
                    })
                ->get();
        $total_daily_payable_interest = $loans->sum('remaining_payable_interest');
        $total_daily_payable_main = 0;

        foreach($loans as $loan) {
            if($loan->remaining_payable_main < $loan->daily_payable_main) {
                $total_daily_payable_main += $loan->remaining_payable_main;
            } else {
                $total_daily_payable_main += $loan->daily_payable_main;
            }
        }

        $target = new BankCollectionDailyTarget();
        $target->deposit_collectable = $total_daily_deposit_amount;
        $target->interest_collectable = $total_daily_payable_interest;
        $target->main_collectable = $total_daily_payable_main;
        $target->total_loan_collectable = $total_daily_payable_interest + $total_daily_payable_main;
        $target->save();
    }
}
