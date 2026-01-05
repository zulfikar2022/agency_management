<?php
namespace App\Http\Controllers;

use App\Models\Bank\Loan;
use App\Models\Bank\Member;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class DataEntryController extends Controller
{
    public function seeAllMembers(){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        $members = Member::where('is_deleted', false)->get();
        return Inertia::render('Admin/Bank/DataEntry/DEAllMembers', [
            'members' => $members,
        ]);
    }

    public function provideLoan(Member $member){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        return Inertia::render('Admin/Bank/DataEntry/DEProvideLoan', [
            'member' => $member,
        ]);
    }

    public function saveLoan(Request $request){
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'total_loan' => 'required|numeric|min:1',
            'safety_money' => 'required|numeric|min:0',
            'created_at' => 'required|date',
        ]);

        // dd($validated);

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
        DB::transaction(function () use ($validated, $member) {
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

            $member->total_loan = $total_loan;
            $member->save();

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
            $loan->created_at = Carbon::parse($validated['created_at'])->startOfDay();
            $loan->updated_at = today();
            $member->timestamps = false;
            $loan->save();
        });

        return redirect()->route('admin.bank.de.all_members', [
            'member' => $validated['member_id'],
        ])->with('message', 'ঋণ সফলভাবে প্রদান করা হয়েছে।');
    }
}