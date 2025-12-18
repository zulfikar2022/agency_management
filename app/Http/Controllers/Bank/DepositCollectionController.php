<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\DepositCollectionUpdateLog;
use App\Models\Bank\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DepositCollectionController extends Controller
{
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
    public function create()
    {
        //
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
    public function show(DepositCollection $depositCollection)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DepositCollection $depositCollection)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DepositCollection $depositCollection)
    {
        $validated = $request->validate([
            'deposit_amount' => 'required|numeric|min:0',
        ]); 
        $deposit_id = $depositCollection->deposit_id;
        $deposit = Deposit::find($deposit_id);
        $member = Member::find($deposit->member_id);

        // day filter
        $today = now()->format('Y-m-d');
        if($depositCollection->deposit_date != $today){
            return back()->withErrors(['deposit_amount' => 'শুধুমাত্র আজকের তারিখের সঞ্চয় আপডেট করা যাবে।']);
        }

        DB::transaction(function () use ($validated, $depositCollection, $member){
            // update the total_deposit of the member
            $member->total_deposit = $member->total_deposit - $depositCollection->deposit_amount + ($validated['deposit_amount'] * 100);
            $member->save();

              //create an entry to the deposit_collection_update_logs table
            $deposit_collection_update_log = new DepositCollectionUpdateLog();
            $deposit_collection_update_log->deposit_collection_id = $depositCollection->id;
            $deposit_collection_update_log->updating_user_id = Auth::id();
            $deposit_collection_update_log->deposit_amount_before_update = $depositCollection->deposit_amount;
            $deposit_collection_update_log->deposit_amount_after_update = $validated['deposit_amount'] * 100;
            $deposit_collection_update_log->save();

            // update the deposit collection
            $depositCollection->deposit_amount = $validated['deposit_amount'] * 100; // store in cents
            $depositCollection->save();

          
            
        });


        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DepositCollection $depositCollection)
    {
        //
    }
}
