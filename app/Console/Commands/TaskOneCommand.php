<?php

namespace App\Console\Commands;

use App\Models\Bank\Loan;
use Carbon\Carbon;
use Illuminate\Console\Command;





class TaskOneCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:task-one-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'যে সকল লোণের লাস্ট পরিশোধের তারিখ অতিক্রম করেছে কিন্তু সম্পূর্ণ পরিশোধ করা হয়নি তাদের লোন গুলোকে ডেইলি ইন্টারেস্ট সহ আপডেট করা।';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $loans = Loan::where('is_deleted', false)
            ->whereDate('last_paying_date', '<', Carbon::today())
            ->where(function ($query) {
                $query->where('remaining_payable_main', '>', 0)
                      ->orWhere('remaining_payable_interest', '>', 0);
            })
            ->get();

        foreach ($loans as $loan) {
            $payable_main = $loan->remaining_payable_main;
            $payable_interest = $loan->remaining_payable_interest;

            $loan->remaining_payable_main = $payable_main + $payable_interest;
            $loan->remaining_payable_interest = round((($payable_main + $payable_interest) * 0.15) / 115);

            $loan->daily_payable_main = round(($payable_main + $payable_interest) / 115);
            $loan->daily_payable_interest = round((($payable_main + $payable_interest) * 0.15) / 115);
            $loan->last_paying_date = Carbon::today()->addDays(115);

            $loan->save();
        }
    }
}
