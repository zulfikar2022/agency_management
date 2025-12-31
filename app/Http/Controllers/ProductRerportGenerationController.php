<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerProduct;
use App\Models\Product;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\ProductCustomerMoneyCollectionUpdateLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Browsershot\Browsershot;

class ProductRerportGenerationController extends Controller {
    public function generateEmployeeWiseProductCollectionReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'employee_id' => 'required|exists:users,id',
        ]);

        $employee = User::find($validated['employee_id']);
        
        $collections = ProductCustomerMoneyCollection::where('collecting_user_id', $validated['employee_id'])
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->orderBy('created_at', 'desc')
            ->get();

        // each collection has a customer_id field and we need to get the customer name from the Customer model
        $total_collection = 0;
        $total_collectable = 0;
        foreach($collections as $collection){
            $total_collection += $collection->collected_amount;
            $total_collectable += $collection->collectable_amount;
            $customer = Customer::find($collection->customer_id);
            $collection->customer_name = $customer ? $customer->name : 'Unknown Customer';
        }
        
        
         $html = view('pdf.product-employee-wise-collection-report', [
            'collections' => $collections,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'employee' => $employee,
            'total_collection' => $total_collection,
            'total_collectable' => $total_collectable,
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'product_collection_report_' .$employee->name.'_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');



    }

    public function generateProductSalesReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);
    // dd($validated);
        $sales = CustomerProduct::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();

        $total_sales_amount = 0;
        $total_down_payment = 0;
        // each sale has a customer_id field and we need to get the customer name from the Customer model
        foreach($sales as $sale){
            $total_sales_amount += $sale->total_payable_price;
            $total_down_payment += $sale->downpayment;
            $customer = Customer::find($sale->customer_id);
            $product = Product::find($sale->product_id);
            $seller = User::find($sale->user_id);

            $sale->seller_name = $seller ? $seller->name : 'Unknown Seller';
            $sale->product_name = $product ? $product->name : 'Unknown Product';
            $sale->customer_name = $customer ? $customer->name : 'Unknown Customer';
        }

        // dd($sales);
        
        
         $html = view('pdf.product-sales-report', [
            'sales' => $sales,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_sales_amount' => $total_sales_amount,
            'total_down_payment' => $total_down_payment,
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'product_sales_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateProductCollectionReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        $collections = ProductCustomerMoneyCollection::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->orderBy('created_at', 'desc')
            ->get();

        $total_collection = 0;
        $total_collectable = 0;
        foreach($collections as $collection){
            $total_collection += $collection->collected_amount;
            $total_collectable += $collection->collectable_amount;

            $customer = Customer::find($collection->customer_id);
            $collection->customer_name = $customer ? $customer->name : 'Unknown Customer';
        }

        // dd($collections);
        
        
         $html = view('pdf.product-collection-report', [
            'collections' => $collections,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_collection' => $total_collection,
            'total_collectable' => $total_collectable,
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'product_collection_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefProductSalesReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);
        
        $sales = CustomerProduct::with('creator')
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
            
            // each sale has a user_id field and we need to group by user_id and get total sales amount and total downpayment per user
            
            $entire_sales_amount = 0;
            $entire_down_payment = 0;
            $grouped_sales = [];

            foreach($sales as  $sale){
                $entire_down_payment += $sale->downpayment;
                $entire_sales_amount += $sale->total_payable_price;
                
                if(!isset($grouped_sales[$sale->user_id])){
                    $total_sell = 0;
                    $total_downpayment = 0;
                    foreach($sales as $s){
                        if($s->user_id == $sale->user_id){
                            $total_sell += $s->total_payable_price;
                            $total_downpayment += $s->downpayment;
                        }
                    }
                    $grouped_sales[$sale->user_id] = [
                        'user_name' => $sale->creator ? $sale->creator->name : 'Unknown',
                        'user_id' => $sale->user_id,
                        'total_sales_amount' => $total_sell,
                        'total_down_payment' => $total_downpayment,
                    ];
                }
            }

            $html = view('pdf.brief-product-sales-report', [
                'sales' => $grouped_sales,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_sales_amount' => $entire_sales_amount,
                'total_down_payment' => $entire_down_payment,
            ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'brief_product_sales_report_' . $todayDate . '.pdf';
        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefProductCollectionReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);
        
        $collections = ProductCustomerMoneyCollection::with('creator')
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $grouped_collections = [];
        $entire_collection = 0;
        // $entire_collectable = 0;

        foreach($collections as $collection){
            $entire_collection += $collection->collected_amount;
            // $entire_collectable += $collection->collectable_amount;

            if(!isset($grouped_collections[$collection->collecting_user_id])){
                $total_collected = 0;
                // $total_collectable = 0;
                foreach($collections as $c){
                    if($c->collecting_user_id == $collection->collecting_user_id){
                        $total_collected += $c->collected_amount;
                        // $total_collectable += $c->collectable_amount;
                    }
                }
                $grouped_collections[$collection->collecting_user_id] = [
                    'user_name' => $collection->creator ? $collection->creator->name : 'Unknown',
                    'user_id' => $collection->collecting_user_id,
                    'total_collected_amount' => $total_collected,
                    // 'total_collectable_amount' => $total_collectable,
                ];
            }
        }

        $html = view('pdf.brief-product-collection-report', [
            'collections' => $grouped_collections,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_collection' => $entire_collection,
            // 'total_collectable' => $entire_collectable,
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'brief_product_collection_report_' . $todayDate . '.pdf';  
        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }
}