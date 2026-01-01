<?php

namespace App\Console\Commands;

use App\Models\Customer;
use App\Models\ProductCollectionDailyTarget;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessProductCollectionDailyTarget extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-product-collection-daily-target';

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
        $today = strtolower(Carbon::today()->format('l'));
        $customers = Customer::with('purchases')->where('is_deleted', false)->where('collection_day', $today)->get();

        $total_weekly_payable_price = 0;
        foreach ($customers as $customer) {
            foreach ($customer->purchases as $purchase) {
                if($purchase->remaining_payable_price >= $purchase->weekly_payable_price){
                    $total_weekly_payable_price += $purchase->weekly_payable_price;
                } else{
                    $total_weekly_payable_price += $purchase->remaining_payable_price;
                }
            }
        }

        $target = new ProductCollectionDailyTarget();
        $target->total_collectable = $total_weekly_payable_price;
        $target->day = $today;
        $target->is_deleted = false;
        $target->save();
    }
}