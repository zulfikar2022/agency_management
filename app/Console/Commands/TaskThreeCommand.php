<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Bank\Loan;
use App\Models\Bank\Member;
use Carbon\Carbon;

class TaskThreeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:task-three-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'mark as deleted to the completed loans.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $loans = Loan::where('is_deleted', false)
            ->where(function ($query) {
                $query->where('remaining_payable_main', '>', 0)
                      ->orWhere('remaining_payable_interest','>', 0);
            })->get();

        foreach ($loans as $loan) {
            $daily_payable_interest = $loan->daily_payable_interest;
            $loan->remaining_payable_interest = $loan->remaining_payable_interest + $daily_payable_interest;
            $loan->save();
        }
    }
}
