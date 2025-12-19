<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use Illuminate\Http\Request;
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
        return Inertia::render('Employee/Bank/EmployeeCollectInstallment', [
            'member' => $member,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
