<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Bank\Loan;
use App\Models\Bank\Member;
use Carbon\Carbon;


class TaskTwoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:task-two-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'it runs  to calculate daily interest with the previous day interest.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $loans = Loan::where('is_deleted', false)
            ->whereDate('last_paying_date', '>=', Carbon::today())
            ->where('remaining_payable_interest',  0)
            ->where('remaining_payable_main', 0)
            ->get();

        foreach ($loans as $loan) {
            $loan->is_deleted = true;
            $loan->save();
            $member = Member::find($loan->member_id);
            if ($member) {
                $member->total_loan = 0;
                $member->save();
            }
        }
    }
}
