<?php

namespace App\Http\Controllers\Bank;

use App\Http\Controllers\Controller;
use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\DepositCollectionUpdateLog;
use App\Models\Bank\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

class DepositController extends Controller
{

    public function depositCollections(Deposit $deposit){
        $member = Member::find($deposit->member_id);

        $deposit_collections =  DepositCollection::where('deposit_id', $deposit->id)   
            ->where('is_deleted', false)
            ->orderBy('created_at', 'desc')
            ->get();

        $deposit_collections->transform(function ($item) {
            $updates = DepositCollectionUpdateLog::where('deposit_collection_id', $item->id)->orderBy('created_at', 'desc')->get();
            $updates->transform(function ($update) {
                $updating_user = User::find($update->updating_user_id);
                $update->updating_user_name = $updating_user ? $updating_user->name : 'Unknown';
                return $update;
            });
            $item->updates = $updates;
            return $item;
        });

        return Inertia::render('Admin/Bank/DepositCollections', [
            'member' => $member,
            // 'deposit' => $deposit,
            'deposit_collections' => $deposit_collections,
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
        // dd($member);
        // find the deposit by member id
        $deposit = Deposit::where('member_id', $member->id)
        ->where('is_deleted', false)
        ->where('last_depositing_predictable_date', '>=', now()->format('Y-m-d'))
        ->first();
        return Inertia::render('Employee/Bank/EmployeeCollectDeposit', [
            'member' => $member,
            'deposit' => $deposit,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'deposit_amount' => 'required|numeric|min:0',
            'deposit_id' => 'required|exists:deposits,id',
        ]);

        // find if the deposit exists with depost_id and deposit_date = today
        $existing_deposit = DepositCollection::where('deposit_id', $validated['deposit_id'])
            ->where('deposit_date', now()->format('Y-m-d'))
            ->where('is_deleted', false)
            ->first();
        if ($existing_deposit) {
            return back()->withErrors(['deposit_amount' => 'আজকের তারিখের জন্য এই সঞ্চয় ইতিমধ্যে জমা করা হয়েছে।']);
        }

       DB::transaction(function () use ($validated){
        $deposit = Deposit::find($validated['deposit_id']);
         // create a deposit record
        $deposit_collection = new DepositCollection();

        $deposit_collection->deposit_id = $validated['deposit_id'];
        $deposit_collection->collecting_user_id = Auth::id();
        $deposit_collection->deposit_amount = $validated['deposit_amount'] * 100; // store in cents
        $deposit_collection->deposit_date = now()->format('Y-m-d');
        $deposit_collection->is_deleted = false;
        $deposit_collection->depositable_amount = $deposit->daily_deposit_amount;
        $deposit_collection->save();
        // find the member from the deposit_id
        $deposit = Deposit::find($validated['deposit_id']);
        $member = Member::find($deposit->member_id);
        $member->total_deposit += $validated['deposit_amount'] * 100;
        $member->save();
       });

        return redirect()->route('employee.bank.members')->with('success', 'সঞ্চয় সফলভাবে জমা করা হয়েছে।');

    }

    public function notDepositedToday(){
       $today = now()->format('Y-m-d');
       $search = request()->query('search', '');

       $todays_deposit_ids = DepositCollection::where('deposit_date', $today)
            ->where('is_deleted', false)
            // ->where('last_depositing_predictable_date', '>=', $today)
            ->pluck('deposit_id')
            ->toArray();
            // dd($todays_deposit_ids);
        $members_ids_not_deposits_today = Deposit::whereNotIn('id', $todays_deposit_ids)
            ->where('is_deleted', false)
            ->pluck('member_id')
            ->toArray();
        $members_not_deposited_today = Member::whereIn('id', $members_ids_not_deposits_today)
            ->where('is_deleted', false)
            ->where(function($query) use ($search){
                $query->where('name', 'like', '%'.$search.'%')
                    ->orWhere('id', $search)
                    ->orWhere('address', 'like', '%'.$search.'%')
                    ->orWhere('fathers_name', 'like', '%'.$search.'%');
            })
            ->paginate(10);

        // find the deposit of each member and attach it to the member using transform method
        $members_not_deposited_today->transform(function($member){
            $deposit = Deposit::where('member_id', $member->id)
                ->where('is_deleted', false)
                ->where('last_depositing_predictable_date', '>=', now()->format('Y-m-d'))
                ->first();
            $member->deposit_account = $deposit;
            return $member;
        });
        
            


        return Inertia::render('Employee/Bank/EmployeeNotDepositedToday', [
            'members' => $members_not_deposited_today,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Deposit $deposit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deposit $deposit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'deposit_id' => 'required|exists:deposits,id',
            'daily_deposit_amount' => 'required|numeric|min:0',
        ]);

        $deposit = Deposit::find($validated['deposit_id']);
        $member = Member::find($deposit->member_id);

        $today = now()->format('Y-m-d');
        $deposit_date = $deposit->created_at->format('Y-m-d');
        if($today != $deposit_date){
            return back()->withErrors(['daily_deposit_amount' => 'শুধুমাত্র আজকের তারিখে তৈরি করা সঞ্চয় একাউন্টের দৈনিক সঞ্চয় পরিমাণ আপডেট করা যাবে।']);
        }

        $deposit->daily_deposit_amount = $validated['daily_deposit_amount'] * 100;
        $deposit->save();
        
        return redirect()->route('admin.bank.member_details', ['member' => $member->id])->with('success', 'সঞ্চয় একাউন্ট সফলভাবে আপডেট করা হয়েছে।');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deposit $deposit)
    {
        //
    }

   
}
