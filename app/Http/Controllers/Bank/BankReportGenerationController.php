<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\DepositCollectionUpdateLog;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use App\Models\User;
use App\Models\Withdraw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

class BankReportGenerationController{

     public function generateDepositCollectionReport(){
        // extract date from body 
        $validated = request()->validate(rules: [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        $deposit_collections = DepositCollection::where('deposit_date', '>=', $validated['start_date'])
            ->where('deposit_date', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('deposit_date', 'desc')
            ->get();
        
            $total_collection = 0;
        foreach ($deposit_collections as $deposit_collection) {
            $deposit = Deposit::find($deposit_collection->deposit_id);
            $total_collection += $deposit_collection->deposit_amount;
            $member = Member::find($deposit->member_id);

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
        $loan_collections = LoanCollection::where('paying_date', '>=', $validated['start_date'])
            ->where('paying_date', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('paying_date', 'desc')
            ->get();
        
        $total_collection = 0;
        foreach ($loan_collections as $loan_collection) {
            $total_collection += $loan_collection->paid_amount;
            $loan = Loan::find($loan_collection->loan_id);
            $member = Member::find($loan->member_id);
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
        $withdraws = Withdraw::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $total_withdraw = 0;
        foreach ($withdraws as $withdraw) {
            $total_withdraw += $withdraw->withdraw_amount;
            $deposit = Deposit::find($withdraw->deposit_id);
            $member = Member::find($deposit->member_id);
            $withdraw->member_name = $member->name;
            $withdraw->member_id = $member->id;
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
        $loans = Loan::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        // each loan has a member_id field and we need to get the member from that id and put it into the loan object as a member field
        $total_provided_loan = 0;
        
        foreach ($loans as $loan) {
            $total_provided_loan += $loan->total_loan;
            $member = Member::find($loan->member_id);
            $loan->member_name = $member->name;
            $loan->member_id = $member->id;
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
        $deposits = Deposit::whereDate('created_at', '>=', $validated['start_date'])
            ->whereDate('created_at', '<=', $validated['end_date'])
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();
        // each loan has a member_id field and we need to get the member from that id and put it into the loan object as a member field
        foreach ($deposits as $deposit) {
            $member = Member::find($deposit->member_id);
            $deposit->member_name = $member->name;
            $deposit->member_id = $member->id;
            $deposit->total_deposit = $member->total_deposit;
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
}