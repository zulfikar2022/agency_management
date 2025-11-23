<?php 

namespace App\Http\Controllers\AdminController;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductUpdateLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
     public function dashboard(){
        $leanUser = request()->get('user');

        // first feature: total number of customers which are not deleted (DONE)
        $totalCustomers = Customer::where('is_deleted', false)->count();

        // find the date of today in the format yyyy-mm-dd and also make an array of dates for the last 7 days
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $last7Days[] = now()->subDays($i)->format('Y-m-d');
        }

        $collections = ProductCustomerMoneyCollection::whereIn('collecting_date', $last7Days)->select('collecting_date', 'collected_amount', 'collectable_amount')
            ->get();

        
        $groupedCollections = [];
        foreach ($collections as $collection) {
            $date = $collection->collecting_date;
            if (!isset($groupedCollections[$date])) {
                $groupedCollections[$date] = [
                    'collected_amount' => 0,
                    'collectable_amount' => 0
                ];
            }
            $groupedCollections[$date]['collected_amount'] += $collection->collected_amount;
            $groupedCollections[$date]['collectable_amount'] += $collection->collectable_amount;
        }

        $purchases = CustomerProduct::where('is_deleted', false)->select('id', 'product_id', 'quantity', 'total_payable_price', 'remaining_payable_price')
            ->get();

        $purchases->transform(function ($purchase) {
            $product = Product::find($purchase->product_id);
            $purchase->product_name = $product ? $product->name : 'Unknown Product';
            return $purchase;
            
        });

        // from the purchases collection, find the total purchased quantity, total payable price and total remaining payable price grouped by product_id
        $groupedPurchases = [];
        foreach ($purchases as $purchase) {
            $productId = $purchase->product_id;
            if (!isset($groupedPurchases[$productId])) {
                $groupedPurchases[$productId] = [
                    'product_name' => $purchase->product_name,
                    'total_quantity' => 0,
                    'total_payable_price' => 0,
                    'total_remaining_payable_price' => 0
                ];
            }
            $groupedPurchases[$productId]['total_quantity'] += $purchase->quantity;
            $groupedPurchases[$productId]['total_payable_price'] += $purchase->total_payable_price;
            $groupedPurchases[$productId]['total_remaining_payable_price'] += $purchase->remaining_payable_price;
        }

        $stock_products_total_price = Product::where('is_deleted', false)->where('is_available', true)->get()->reduce(function ($carry, $product) {
            return $carry + ($product->current_quantity * $product->buying_price_per_product);
        }, 0);

        // sold products total price
        $sold_products_total_price = CustomerProduct::where('is_deleted', false)->where('remaining_payable_price', '>', 0)->get()->reduce(function ($carry, $purchase) {
            return $carry + $purchase->total_payable_price;
        }, 0);

        $temaining_purchases_ids = CustomerProduct::where('is_deleted', false)->where('remaining_payable_price', '>', 0)->pluck('id')->toArray();
        
        $total_collected_amount = ProductCustomerMoneyCollection::whereIn('customer_products_id', $temaining_purchases_ids)->sum('collected_amount');

        $total_downpayment_amount = CustomerProduct::where('remaining_payable_price', '>', 0)->get()->sum('downpayment');

        return Inertia::render('Admin/Dashboard', [
            'user' => $leanUser,
            'totalCustomers' => $totalCustomers, 
            'sevenDayCollections' => $groupedCollections,
            'purchasesSummary' => $groupedPurchases, 
            'stockProductsTotalPrice' => $stock_products_total_price,
            'soldProductsTotalPrice' => $sold_products_total_price,
            'totalCollectedAmount' => $total_collected_amount + $total_downpayment_amount,
        ]);
    }

    // create product page
   
}
