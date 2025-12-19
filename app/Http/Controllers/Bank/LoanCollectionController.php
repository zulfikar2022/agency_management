<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoanCollectionController extends Controller
{

    function notInstallmentedToday()
    {
        //
        $search = request()->query('search', '');
        $today = now()->format('Y-m-d');
        $todays_collections = LoanCollection::where('paying_date', $today)
            ->where('is_deleted', false)
            ->get()
            ->pluck('loan_id')
            ->toArray();

            // find loans which are not in todays_collections and have remaining_payable_amount > 0
        $loans_not_paid_today = Loan::whereNotIn('id', $todays_collections)
            ->where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->get();
        $members = Member::whereIn('id', $loans_not_paid_today->pluck('member_id'))
        ->where('is_deleted', false)
        ->where(function ($query) use ($search) {
            $query->where('name', 'like', '%' . $search . '%')
                // ->orWhere('phone_number', 'like', '%' . $search . '%')
                ->orWhere('id', 'like', '%' . $search . '%');
        })
        ->paginate(10);
        // dd($members);

        return Inertia::render('Employee/Bank/EmployeeNotInstallmantedToday', [
            'members' => $members,
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
        // find the loan instance of the member
        $loan = Loan::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where('remaining_payable_amount', '>', 0)
            ->first();         
        return Inertia::render('Employee/Bank/EmployeeCollectInstallment', [
            'member' => $member,
            'loan' => $loan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'paid_amount' => 'required|numeric|min:0.01',
        ]);

        $loan = Loan::find($validated['loan_id']);
        if ($validated['paid_amount'] * 100 > $loan->remaining_payable_amount) {
            return redirect()->back()->withErrors(['paid_amount' => 'যত টাকা বাকি আছে তার থেকে বেশি পরিশোধ করতে পারবেন না। '])->withInput();
        }

        $toay = now()->format('Y-m-d');
        $existing_collection = LoanCollection::where('loan_id', $validated['loan_id'])
            ->where('paying_date', $toay)
            ->where('is_deleted', false)
            ->first();
        if ($existing_collection) {
            return redirect()->back()->withErrors(['paid_amount' => 'এই ঋণের জন্য আজকের তারিখে একটি কিস্তি ইতিমধ্যেই সংগ্রহ করা হয়েছে।'])->withInput();
        }   

        DB::transaction(function () use ($validated, $loan) {
            $loan_collection = new LoanCollection();
            $loan_collection->loan_id = $validated['loan_id'];
            $loan_collection->collecting_user_id = Auth::id();
            $loan_collection->paid_amount = $validated['paid_amount'] * 100; // store in cents
            $loan_collection->paying_date = now()->format('Y-m-d');
            $loan_collection->is_deleted = false;
            $loan_collection->save();

            // update the loan's remaining_payable_amount
            // $loan = Loan::find($validated['loan_id']);
            $loan->remaining_payable_amount -= $validated['paid_amount'] * 100;
            $loan->save();
        });
        
        return redirect()->route('employee.bank.member_details', [
            'member' => Loan::find($validated['loan_id'])->member_id
        ])->with('success', 'Installment collected successfully.');
       
    }

    /**
     * Display the specified resource.
     */
    public function show(LoanCollection $loanCollection)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LoanCollection $loanCollection)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LoanCollection $loanCollection)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoanCollection $loanCollection)
    {
        //
    }
}
