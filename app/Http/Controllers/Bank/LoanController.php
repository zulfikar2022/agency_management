<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\LoanCollectionUpdateLog;
use App\Models\Bank\LoanUpdateLog;
use App\Models\Bank\Member;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function Symfony\Component\Clock\now;

// use Inertia\Inertia;

class LoanController extends Controller
{
    public function loanInstallmentCollections(Loan $loan){
        $member = Member::find($loan->member_id);

        $loan_installment_collections = LoanCollection::where('loan_id', $loan->id)   
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();

        // transform each loan_installment_collections item: from the id of loan_colection find to the loan_collection_update_logs and attach to the item as updates
        $loan_installment_collections->transform(function ($item) {
            $updates = LoanCollectionUpdateLog::where('loan_collection_id', $item->id)->orderBy('created_at', 'desc')->get();
            // each update has a field named updating_user_id, find the user name from the id and attach to the update as updating_user_name
            $updates->transform(function ($update) {
                $updating_user = User::find($update->updating_user_id);
                $update->updating_user_name = $updating_user ? $updating_user->name : 'Unknown';
                return $update;
            });
            $item->updates = $updates;
            return $item;
        });

        return Inertia::render('Admin/Bank/LoanCollections', [
            'member' => $member,
            // 'loan' => $loan,
            'loan_collections' => $loan_installment_collections,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Member $member)
    {
        return Inertia::render('Admin/Bank/ProvideLoan', [
            'member' => $member,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'total_loan' => 'required|numeric|min:1',
            'safety_money' => 'required|numeric|min:0',
            
        ]);

        $loan = Loan::where('member_id', $validated['member_id'])
            ->where('is_deleted', false)
            ->where(function ($query) {
                $query->where('remaining_payable_main', '>', 0)
                      ->orWhere('remaining_payable_interest', '>', 0);
            })
            ->first();

        if ($loan) {
            return redirect()->back()->withErrors(['message' => 'এই সদস্যের একটি চলমান ঋণ রয়েছে। নতুন ঋণ প্রদান করা যাবে না।'])->withInput();
        }

        $member = Member::findOrFail($validated['member_id']);

        if($member->total_deposit < $validated['safety_money'] * 100 ){
            return redirect()->back()->withErrors(['message' => 'সদস্যের মোট জমার পরিণাম জামানতের চেয়ে কম হতে পারবে না।'])->withInput();
        }
        // dd("before transaction", $validated);
        DB::transaction(function () use ($validated) {
            $member_id = $validated['member_id'];
            $total_loan = $validated['total_loan'] * 100; 
            $safety_money = $validated['safety_money'] * 100; 

            $share_money = $total_loan * 0.025;
            $loan_fee = 3000; // fixed loan fee ৩০০০ টাকা

            $daily_payable_main = round($total_loan / 115); // 115 দিনের মধ্যে মূল টাকা পরিশোধ করতে হবে
            $daily_payable_interest = round(($total_loan * 0.15) / 115); // মোট ১৫% সুদ দিতে হবে, যা 115 দিনের মধ্যে পরিশোধ করতে হবে
            $remaining_payable_interest = 0;
            $remaining_payable_main = $total_loan;
            $last_paying_date = Carbon::now()->addDays(115)->format('Y-m-d');

            // create a new loan instance
            $loan = new Loan();
            $loan->member_id = $member_id;
            $loan->creating_user_id = Auth::id();
            $loan->total_loan = $total_loan;
            $loan->daily_payable_main = $daily_payable_main;
            $loan->daily_payable_interest = $daily_payable_interest;
            $loan->remaining_payable_interest = $remaining_payable_interest;
            $loan->last_paying_date = $last_paying_date;
            $loan->remaining_payable_main = $remaining_payable_main;
            $loan->total_paid = 0;
            $loan->safety_money = $safety_money;
            $loan->share_money = $share_money;
            $loan->loan_fee = $loan_fee;
            $loan->is_deleted = false;
            $loan->save();
        });

        return redirect()->route('admin.bank.member_details', [
            'member' => $validated['member_id'],
        ])->with('message', 'ঋণ সফলভাবে প্রদান করা হয়েছে।');

    }



    /**
     * Display the specified resource.
     */
    public function show(Loan $loan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Loan $loan)
    {
        // dd($loan);
        $member = Member::find($loan->member_id);
        return Inertia::render('Admin/Bank/UpdateLoan', [
            'loan' => $loan,
            'member' => $member,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'total_loan' => 'required|numeric|min:1',
            'safety_money' => 'required|numeric|min:0',
        ]);

        $safety_money = $validated['safety_money'] * 100;
        $total_loan = $validated['total_loan'] * 100;   

        $loan = Loan::find($validated['loan_id']);
        $member = Member::find($loan->member_id);

        $today = now()->format('Y-m-d');
        $loan_creation_day = $loan->created_at->format('Y-m-d');

        if ($today !== $loan_creation_day) {
            return redirect()->back()->withErrors(['message' => 'শুধুমাত্র ঋণ তৈরির দিনে ঋণ আপডেট করা যেতে পারে।'])->withInput();
        }

        if($member->total_deposit < $safety_money ){
            return redirect()->back()->withErrors(['message' => 'সদস্যের মোট জমার পরিণাম জামানতের চেয়ে কম হতে পারবে না।'])->withInput();
        }

        if($loan->creating_user_id !== Auth::id()){
            return redirect()->back()->withErrors(['message' => 'আপনার এই ঋণ আপডেট করার অনুমতি নেই কারণ আপনি এটি প্রদান করেননি।'])->withInput();
        }

        DB::transaction(function() use($total_loan, $validated, $loan, $member, $safety_money){
            
            // create an instance of loan_update_logs
            $loan_update_log = new LoanUpdateLog();
            $loan_update_log->loan_id = $loan->id;
            $loan_update_log->updating_user_id = Auth::id();
            $loan_update_log->total_loan_before_update = $loan->total_loan;
            $loan_update_log->total_loan_after_update = $total_loan;
            $loan_update_log->safety_money_before_update = $loan->safety_money;
            $loan_update_log->safety_money_after_update = $safety_money;
            // $loan_update_log->total_payable_amount_before_update = $loan->total_payable_amount;
            // $new_total_payable_amount = $total_loan + ($total_loan * 0.15);
            // $loan_update_log->total_payable_amount_after_update = $new_total_payable_amount;
            $loan_update_log->save();

            // update member 
            $member->total_loan = $total_loan;
            $member->save();

            // update the loan instance
            $loan->total_loan = $total_loan;
            $loan->safety_money = $safety_money;
            $loan->share_money = $total_loan * 0.025;
            $loan->daily_payable_main = round($total_loan / 115);
            $loan->daily_payable_interest = round(($total_loan * 0.15) / 115);
            $loan->remaining_payable_main = $total_loan;


            $loan->save();
        });

        return redirect()->route('admin.bank.member_details', [
            'member' => $member->id,
        ])->with('message', 'ঋণ সফলভাবে আপডেট করা হয়েছে।');



    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Loan $loan)
    {
        //
    }
}
