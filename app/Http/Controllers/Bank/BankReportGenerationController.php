<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\DepositCollectionUpdateLog;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use App\Models\Cost;
use App\Models\CustomerProduct;
use App\Models\DepositDismissal;
use App\Models\MemberAccountDismissal;
use App\Models\ProductCustomerMoneyCollection;
use App\Models\User;
use App\Models\Withdraw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

class BankReportGenerationController{
     public function employeeWiseCollectionReport(){

        $employees = User::where('is_employee', true)->where('is_deleted', false)->get();

        return Inertia::render('Admin/Bank/EmployeeWiseCollection', [
            'employees' => $employees,
        ]);
    } 

     public function generateDepositCollectionReport(){
        // extract date from body 
        $validated = request()->validate(rules: [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
            $deposit_collections = DepositCollection::with('deposit.member:id,name')
            ->where('deposit_date', '>=', $validated['start_date'])
            ->where('deposit_date', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('deposit_date', 'desc')
            ->get();
                
            $total_collection = 0;
        foreach ($deposit_collections as $deposit_collection) {
            $deposit = $deposit_collection->deposit;
            $total_collection += $deposit_collection->deposit_amount;
            $member = $deposit->member;

            $deposit_collection->member_name = $member->name;
            $deposit_collection->member_id = $member->id;
        }

        
        

         $html = view('pdf.bank-deposit-collection-report', [
            'deposit_collections' => $deposit_collections,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_collection' => $total_collection,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'deposit_collection_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
        
    }

    public function generateLoanCollectionReport(){
         // extract date from body 
        $validated = request()->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        $loan_collections = LoanCollection::with('loan.member:id,name')->where('paying_date', '>=', $validated['start_date'])
            ->where('paying_date', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('paying_date', 'desc')
            ->get();
        
        $total_collection = 0;
        foreach ($loan_collections as $loan_collection) {
            $total_collection += $loan_collection->paid_amount;
            $loan = $loan_collection->loan;
            $member = $loan->member;
            $loan_collection->member_name = $member->name;
            $loan_collection->member_id = $member->id;
            
        }

         $html = view('pdf.bank-loan-collection-report', [
            'loan_collections' => $loan_collections,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_collection' => $total_collection,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'loan_collection_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateWithdrawReport(){
         // extract date from body 
        $validated = request()->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        $withdraws = Withdraw::with('deposit.member:id,name')->whereDate    ('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $total_withdraw = 0;
        foreach ($withdraws as $withdraw) {
            $total_withdraw += $withdraw->withdraw_amount;
            $deposit = $withdraw->deposit;
            $member = $deposit->member;
            $withdraw->member_name = $member->name;
            $withdraw->member_id = $member->id;
            unset($withdraw->deposit);

        }

         $html = view('pdf.bank-withdraw-report', [
            'withdraws' => $withdraws,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_withdraw' => $total_withdraw,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'withdraw_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateLoansReport(){
        $validated = request()->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        $loans = Loan::with('member:id,name')->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        // each loan has a member_id field and we need to get the member from that id and put it into the loan object as a member field
        $total_provided_loan = 0;
        
        foreach ($loans as $loan) {
            $total_provided_loan += $loan->total_loan;
            $member = $loan->member;
            $loan->member_name = $member->name;
            $loan->member_id = $member->id;
            unset($loan->member);
        }


         $html = view('pdf.bank-loans-report', [
            'loans' => $loans,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_provided_loan' => $total_provided_loan,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'loans_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateDepositReport(){
         $validated = request()->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        $deposits = Deposit::with('member:id,name,total_deposit')->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        // each loan has a member_id field and we need to get the member from that id and put it into the loan object as a member field
        foreach ($deposits as $deposit) {
            $member = $deposit->member;
            $deposit->member_name = $member->name;
            $deposit->member_id = $member->id;
            $deposit->total_deposit = $member->total_deposit;
            unset($deposit->member);
        }


         $html = view('pdf.bank-deposit-report', [
            'deposits' => $deposits,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'deposits_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateEmployeeWiseCollectionReport(){
        $validated = request()->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'employee_id' => 'required|exists:users,id',
        ]);
        // dd($validated);
        $employee = User::where('id', $validated['employee_id'])->where('is_employee', true)->where('is_deleted', false)->first();
        // dd($employee);

        $deposit_collections = DepositCollection::with('deposit.member:id,name,total_deposit')->where('deposit_date', '>=', $validated['start_date'])
            ->where('deposit_date', '<=', $validated['end_date'])
            ->where('collecting_user_id', $employee->id)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'asc')
            ->get();
        $total_deposit_collection = 0;
        foreach ($deposit_collections as $deposit_collection) {
            $total_deposit_collection += $deposit_collection->deposit_amount;
            // find the member based on the deposit id
            $deposit = $deposit_collection->deposit;
            $member = $deposit->member;
            $deposit_collection->member_name = $member->name;
            $deposit_collection->member_id = $member->id;
            unset($deposit_collection->deposit);
        }
        // dd($deposit_collections);

        $loan_collections = LoanCollection::with('loan.member:id,name')->where('paying_date', '>=', $validated['start_date'])
            ->where('paying_date', '<=', $validated['end_date'])
            ->where('collecting_user_id', $employee->id)
            ->where('is_deleted', false)
            ->orderBy('created_at', 'asc')
            ->get();
        $total_loan_collection = 0;
        foreach ($loan_collections as $loan_collection) {
            $total_loan_collection += $loan_collection->paid_amount;   
            // find the member based on the loan id
            $loan = $loan_collection->loan;
            $member = $loan->member;
            $loan_collection->member_name = $member->name;
            $loan_collection->member_id = $member->id; 
        }

            $html = view('pdf.bank-employee-wise-collection-report', [
                'employee' => $employee,
                'deposit_collections' => $deposit_collections,
                'loan_collections' => $loan_collections,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_deposit_collection' => $total_deposit_collection,
                'total_loan_collection' => $total_loan_collection,
            
            ])->render();

            $pdfData = Browsershot::html($html)
                    ->noSandbox()
                    ->showBackground()
                    ->format('A4')
                    ->pdf();
            $todayDate = date('d F Y');
            $filename =  'employee_wise_collection_report_' . $employee->name . '_' . $todayDate . '.pdf';
            return response($pdfData, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefDepositCollectionReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $deposit_collections = DepositCollection::with('collector')
            ->where('deposit_date', '>=', $validated['start_date'])
            ->where('deposit_date', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('deposit_date', 'desc')
            ->get();

            // I want to group deposit collections by collecting_user_id
            $grouped_collections = [];
            $total_collection = 0;
            foreach ($deposit_collections as $collection) {
                $total_collection += $collection->deposit_amount;
                $collector_id = $collection->collecting_user_id;
                if (!isset($grouped_collections[$collector_id])) {
                    $employee_wise_collection = 0;
                    foreach ($deposit_collections as $col) {
                        if ($col->collecting_user_id == $collector_id) {
                            $employee_wise_collection += $col->deposit_amount;
                        }
                    }
                    $grouped_collections[$collector_id] = [
                        'collector_name' => $collection->collector ? $collection->collector->name : 'Unknown',
                        'collecting_user_id' => $collector_id,
                        'employee_wise_collection' => $employee_wise_collection,
                        // 'total_collection' => $total_collection,
                    ];
                }
            }
            
             $html = view('pdf.bank-brief-deposit-collection-report', [
                'grouped_collections' => $grouped_collections,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_collection' => $total_collection,
            
            ])->render();

            $pdfData = Browsershot::html($html)
                    ->noSandbox()
                    ->showBackground()
                    ->format('A4')
                    ->pdf();
            $todayDate = date('d F Y');
            $filename =  'brief_deposit_collection_report_' . $todayDate . '.pdf';
            return response($pdfData, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefLoanCollectionReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        
        $loan_collections = LoanCollection::with('collector')
            ->where('paying_date', '>=', $validated['start_date'])
            ->where('paying_date', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('paying_date', 'desc')
            ->get();

            // I want to group loan collections by collecting_user_id
            $grouped_collections = [];
            $total_collection = 0;
            foreach ($loan_collections as $collection) {
                $total_collection += $collection->paid_amount;
                $collector_id = $collection->collecting_user_id;

                if (!isset($grouped_collections[$collector_id])) {
                    $employee_wise_collection = 0;
                    foreach ($loan_collections as $col) {
                        if ($col->collecting_user_id == $collector_id) {
                            $employee_wise_collection += $col->paid_amount;
                        }
                    }
                    $grouped_collections[$collector_id] = [
                        'collector_name' => $collection->collector ? $collection->collector->name : 'Unknown',
                        'collecting_user_id' => $collector_id,
                        'employee_wise_collection' => $employee_wise_collection,
                    ];
                }
            }
            
             $html = view('pdf.bank-brief-loan-collection-report', [
                'grouped_collections' => $grouped_collections,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_collection' => $total_collection,
            
            ])->render();

            $pdfData = Browsershot::html($html)
                    ->noSandbox()
                    ->showBackground()
                    ->format('A4')
                    ->pdf();
            $todayDate = date('d F Y');
            $filename =  'brief_loan_collection_report_' . $todayDate . '.pdf';
            return response($pdfData, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefWithdrawReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        
        $withdraws = Withdraw::with('creator')
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();

            // I want to group withdraws by withdrawing_user_id
            $grouped_withdraws = [];
            $total_withdraw = 0;
            foreach ($withdraws as $withdraw) {
                $total_withdraw += $withdraw->withdraw_amount;
                $withdrawing_user_id = $withdraw->withdrawing_user_id;

                if (!isset($grouped_withdraws[$withdrawing_user_id])) {
                    $admin_wise_withdraw = 0;
                    foreach ($withdraws as $wd) {
                        if ($wd->withdrawing_user_id == $withdrawing_user_id) {
                            $admin_wise_withdraw += $wd->withdraw_amount;
                        }
                    }
                    $grouped_withdraws[$withdrawing_user_id] = [
                        'creator_name' => $withdraw->creator ? $withdraw->creator->name : 'Unknown',
                        'withdrawing_user_id' => $withdrawing_user_id,
                        'admin_wise_withdraw' => $admin_wise_withdraw,
                    ];
                }
            }
            
             $html = view('pdf.bank-brief-withdraw-report', [
                'grouped_withdraws' => $grouped_withdraws,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'total_withdraw' => $total_withdraw,
            
            ])->render();

            $pdfData = Browsershot::html($html)
                    ->noSandbox()
                    ->showBackground()
                    ->format('A4')
                    ->pdf();
            $todayDate = date('d F Y');
            $filename =  'brief_withdraw_report_' . $todayDate . '.pdf';
            return response($pdfData, 200)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefLoansReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        $loans = Loan::with('creator')
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();

       // group loans based on the creating_user_id
        $grouped_loans = [];
        $total_provided_loan = 0;

        foreach ($loans as $loan) {
            $total_provided_loan += $loan->total_loan;
            $user_id = $loan->creating_user_id;
            if (!isset($grouped_loans[$user_id])) {
                $total_amount = 0;
                foreach ($loans as $l) {
                    if ($l->creating_user_id == $user_id) {
                        $total_amount += $l->total_loan;
                    }
                }
                $grouped_loans[$user_id] = [
                    'user_name' => $loan->creator ? $loan->creator->name : 'Unknown',
                    'user_id' => $user_id,
                    // inside the total_amount key we will store the total amount of loan created by this user
                    'total_amount' => $total_amount,
                ];
            }
        }

          $html = view('pdf.bank-brief-loans-report', [
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'loans' => $grouped_loans,
            'total_provided_loan' => $total_provided_loan,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'brief_loans_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }

    public function generateBriefOverallReport(Request $request){
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // incoming cashes
        $total_admission_fee = Member::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            // ->where('is_deleted', false)
            ->sum('admission_fee') / 100;
        $total_loan_fee = Loan::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('loan_fee') / 100;
        $active_members_ids = Member::where('is_deleted', false)->pluck('id')->toArray();
        $total_share_money = Loan::whereIn('member_id', $active_members_ids)
            ->whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('share_money') / 100;

        $total_deposit_collection = DepositCollection::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('deposit_amount') / 100;
        $total_loan_collection = LoanCollection::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('paid_amount') / 100;
        
        $total_downpayments = CustomerProduct::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('downpayment') ;

        $product_money_collections = ProductCustomerMoneyCollection::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->get();
        $total_product_money_collections = $product_money_collections->sum('collected_amount');
        $total_product_money_collectables = $product_money_collections->sum('collectable_amount');

        // outgoing cashes
        $total_costs = Cost::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('amount');
        $total_provided_loans = Loan::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('total_loan') / 100;

        $total_withdraws = Withdraw::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('withdraw_amount') / 100;
        
        $total_deposit_dismissals_paid = DepositDismissal::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('total_paid') / 100;
        $total_account_dismissals_provided_share_money = MemberAccountDismissal::whereDate('created_at',
            '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->sum('provided_share_money') / 100;
        

         $html = view('pdf.entire-brief-overall-report', [
            // incoming cashes
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_admission_fee' => $total_admission_fee,
            'total_loan_fee' => $total_loan_fee,
            'total_share_money' => $total_share_money,
            'total_deposit_collection' => $total_deposit_collection,
            'total_loan_collection' => $total_loan_collection,
            'total_product_money_collections' => $total_product_money_collections,
            'total_downpayments' => $total_downpayments,
            'total_product_money_collectables' => $total_product_money_collectables,
            // outgoing cashes
            'total_costs' => $total_costs,
            'total_provided_loans' => $total_provided_loans,
            'total_withdraws' => $total_withdraws,
            'total_deposit_dismissals_paid' => $total_deposit_dismissals_paid,
            'total_account_dismissals_provided_share_money' => $total_account_dismissals_provided_share_money,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'brief_overall_report_' . $todayDate . '.pdf';
        return response($pdfData, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
    }
}