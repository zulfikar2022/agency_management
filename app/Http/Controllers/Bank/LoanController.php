<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\LoanCollectionUpdateLog;
use App\Models\Bank\Member;
use App\Models\User;
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
            ->where('remaining_payable_amount', '>', 0)
            ->first();

        if ($loan) {
            return redirect()->back()->withErrors(['message' => 'এই সদস্যের একটি চলমান ঋণ রয়েছে। নতুন ঋণ প্রদান করা যাবে না।'])->withInput();
        }
        
        DB::transaction(function () use ($validated) {
            $member_id = $validated['member_id'];
            $total_loan = $validated['total_loan'] * 100; 
            $safety_money = $validated['safety_money'] * 100; 

            $total_payable = $total_loan + ($total_loan * 0.15);
            $remaining_payable = $total_payable;
            $share_money = $total_loan * 0.025; 
            $loan_fee = 3000;
            $daily_payable_amount = ceil($total_payable / 115);

            // find the member from the member id
            $member = Member::find($member_id);
            $member->total_loan = $total_loan;
            $member->save();

            Loan::create([
                'member_id' => $member_id,
                'creating_user_id' => Auth::id(),
                'total_loan' => $total_loan,
                'safety_money' => $safety_money,
                'total_payable_amount' => $total_payable,
                'last_paying_date' => now()->modify('+115 days')->format('Y-m-d'),
                'remaining_payable_amount' => $remaining_payable,
                'share_money' => $share_money,
                'loan_fee' => $loan_fee,
                'is_deleted' => false,
                'daily_payable_amount' => $daily_payable_amount,
            ]); 
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Loan $loan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Loan $loan)
    {
        //
    }
}
