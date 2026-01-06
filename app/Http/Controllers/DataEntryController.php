<?php
namespace App\Http\Controllers;

use App\Models\Bank\Deposit;
use App\Models\Bank\DepositCollection;
use App\Models\Bank\Loan;
use App\Models\Bank\LoanCollection;
use App\Models\Bank\Member;
use App\Services\SmsService;
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
        $members = Member::where('is_deleted', false)->orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/Bank/DataEntry/DEAllMembers', [
            'members' => $members,
            'dataEntryMode' => $data_entry_mode,
        ]);
    }

    public function memberDetails(Member $member){
        $data_entry_mode = config('services.data_entry.mode', false);
        
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        $deposit = Deposit::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->first();
        $loan = Loan::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where(function ($query) {
                $query->where('remaining_payable_main', '>', 0)
                      ->orWhere('remaining_payable_interest', '>', 0);
            })
            ->first();
        
        $deposit_collections = [];
        $loan_collections = [];

        if($deposit){
            $deposit_collections = DepositCollection::where('deposit_id', $deposit->id) 
                ->where('is_deleted', false)
                ->orderBy('deposit_date', 'desc')
                ->get();
        }
        if($loan){
            $loan_collections = LoanCollection::where('loan_id', $loan->id)
                ->where('is_deleted', false)
                ->orderBy('paying_date', 'desc')
                ->get();
        }
        return Inertia::render('Admin/Bank/DataEntry/DEMemberDetails', [
            'member' => $member,
            'dataEntryMode' => $data_entry_mode,
            'deposit' => $deposit,
            'loan' => $loan,
            'deposit_collections' => $deposit_collections,
            'loan_collections' => $loan_collections,
        ]);
    }

    public function  collectDeposit(Member $member){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        return Inertia::render('Admin/Bank/DataEntry/DECollectDeposit', [
            'member' => $member,
            'dataEntryMode' => $data_entry_mode,
        ]);
    }

    public function saveDeposit(Request $request){
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'deposit_amount' => 'required|numeric|min:1',
        ]);

        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
    
    
        $deposit_amount = $validated['deposit_amount'] * 100; // convert to cents
        
        $member = Member::findOrFail($validated['member_id']);
        $deposit = Deposit::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->first();
            // dd($deposit, $deposit_amount, $member);
        if(!$deposit){
            return redirect()->back()->withErrors(['message' => 'এই সদস্যের জন্য কোন জমা অ্যাকাউন্ট পাওয়া যায়নি।'])->withInput();
        }

        // dd( $deposit->daily_deposit_amount);
            
        $yesterday = Carbon::yesterday()->endOfDay();
        DB::transaction(function () use ($deposit, $deposit_amount, $member, $yesterday) {
            // Create a new deposit collection
            $deposit_collection = new DepositCollection();
            $deposit_collection->deposit_id = $deposit->id;
            $deposit_collection->collecting_user_id = Auth::id();
            $deposit_collection->deposit_amount = $deposit_amount;
            $deposit_collection->depositable_amount = $deposit->daily_deposit_amount;
            $deposit_collection->deposit_date = today();
            $deposit_collection->created_at = $yesterday; // Set to yesterday
            $deposit_collection->updated_at = today();
            $deposit_collection->is_deleted = false;
            $deposit_collection->timestamps = false;
            $deposit_collection->save();


            // Update the member's total deposit
            $member->total_deposit += $deposit_amount;
            $member->save();
        });

        return redirect()->route('admin.bank.de.all_members', [
            'dataEntryMode' => $data_entry_mode,
        ])->with('message', 'জমা সফলভাবে সংগ্রহ করা হয়েছে।');
       

    }

    public function deleteMember(Member $member){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }

        // find all the deposits of that member
        $deposits = Deposit::where('member_id', $member->id)->where('is_deleted', false)->get();
        $deposit_collections = DepositCollection::whereIn('deposit_id', $deposits->pluck('id'))->where('is_deleted', false)->get();

        foreach($deposits as $deposit){
            $deposit->is_deleted = true;
            $deposit->save();
        }
        foreach($deposit_collections as $collection){
            $collection->is_deleted = true;
            $collection->save();
        }

        // find  all the loans of that member
        $loans = Loan::where('member_id', $member->id)->where('is_deleted', false)->get();
        $loan_collections = LoanCollection::whereIn('loan_id', $loans->pluck('id'))->where('is_deleted', false)->get();
        foreach($loans as $loan){
            $loan->is_deleted = true;
            $loan->save();
        }
        foreach($loan_collections as $collection){
            $collection->is_deleted = true;
            $collection->save();
        }

        $member->is_deleted = true;
        $member->save();

        return redirect()->route('admin.bank.de.all_members', [
            'dataEntryMode' => $data_entry_mode,
        ])->with('message', 'সদস্য এবং তার সকল তথ্য সফলভাবে মুছে ফেলা হয়েছে।');

       

       
    }
    public function provideLoan(Member $member){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        return Inertia::render('Admin/Bank/DataEntry/DEProvideLoan', [
            'member' => $member,
            'dataEntryMode' => $data_entry_mode,
        ]);
    }

    public function saveLoan(Request $request){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
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
            // $last_paying_date = Carbon::now()->addDays(115)->format('Y-m-d');
            $last_paying_date = Carbon::parse($validated['created_at'])->addDays(115)->format('Y-m-d');

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
            'dataEntryMode' => $data_entry_mode,
        ])->with('message', 'ঋণ সফলভাবে প্রদান করা হয়েছে।');
    }

    public function collectLoan(Member $member){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        return Inertia::render('Admin/Bank/DataEntry/DECollectLoanCollection', [
            'member' => $member,
            'dataEntryMode' => $data_entry_mode,
        ]);
        
    }

    public function collectLoanSave(Request $request){
        $validated = $request->validate([
            'member_id' => 'required|exists:members,id',
            'paid_amount' => 'required|numeric|min:1',
            'last_collecting_date' => 'required|date',
        ]);

        $total_collected = $validated['paid_amount'] * 100; 
        $main_collected = 0;
        $interest_collected = 0;

        $member = Member::findOrFail($validated['member_id']);

        $loan = Loan::where('member_id', $member->id)
            ->where('is_deleted', false)
            ->where(function ($query) {
                $query->where('remaining_payable_main', '>', 0)
                      ->orWhere('remaining_payable_interest', '>', 0);
            })
            ->first();

        if(!$loan){
            return redirect()->back()->withErrors(['message' => 'এই সদস্যের জন্য কোন চলমান ঋণ পাওয়া যায়নি।'])->withInput();
        }

        $total_days_between_after_loan_creation_and_last_collecting = Carbon::parse($loan->created_at)->diffInDays(Carbon::parse($validated['last_collecting_date']));

        $interest_collected = $loan->daily_payable_interest * $total_days_between_after_loan_creation_and_last_collecting;
        $main_collected = $total_collected - $interest_collected;
        if($main_collected <= 0){
            $interest_collected = $total_collected;
            $main_collected = 0;
        }

        if($main_collected > $loan->remaining_payable_main){
            // send an error back
            return redirect()->back()->withErrors(['message' => 'সংগ্রহকৃত মূল টাকার পরিমাণ বাকি মূল টাকার চেয়ে বেশি হতে পারে না।'])->withInput();
        }

        DB::transaction(function () use($loan, $total_collected, $main_collected, $interest_collected, $validated, $total_days_between_after_loan_creation_and_last_collecting) {
            $loan_collection = new LoanCollection();
            $loan_collection->loan_id = $loan->id;
            $loan_collection->collecting_user_id = Auth::id();
            $loan_collection->paid_amount = $total_collected;
            $loan_collection->main_paid_amount = $main_collected;
            $loan_collection->interest_paid_amount = $interest_collected;
            $loan_collection->paying_date = $validated['last_collecting_date'];
            $loan_collection->created_at = Carbon::parse($validated['last_collecting_date'])->startOfDay();
            $loan_collection->updated_at = today();
            $loan_collection->is_deleted = false;
            $loan_collection->save();

            $loan->remaining_payable_main -= $main_collected;

            $loan->remaining_payable_interest  = Carbon::parse($validated['last_collecting_date'])->diffInDays(Carbon::now()) * $loan->daily_payable_interest + ($loan->daily_payable_interest * $total_days_between_after_loan_creation_and_last_collecting - $interest_collected);
           
            $loan->save();
        });

       
        return redirect()->route('admin.bank.de.all_members', [
            'dataEntryMode' => config('services.data_entry.mode', false),
        ])->with('message', 'কিস্তি সফলভাবে সংগ্রহ করা হয়েছে।');


    }

    public function updateDepositCollection(DepositCollection $deposit_collection){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        $deposit = Deposit::find($deposit_collection->deposit_id);
        if(!$deposit){
            return redirect()->route('home');
        }
        $member = Member::find($deposit->member_id);
        if(!$member){
            return redirect()->route('home');
        }
        return Inertia::render('Admin/Bank/DataEntry/DEUpdateDepositCollection', [
            'member' => $member,
            'depositCollection' => $deposit_collection,
            'dataEntryMode' => $data_entry_mode,
        ]);
    }

    public function saveUpdatedDepositCollection(Request $request){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }

        $validated = $request->validate([
            'deposit_collection_id' => 'required|exists:deposit_collections,id',
            'deposit_amount' => 'required|numeric|min:1',
        ]);

        $deposit_collection = DepositCollection::findOrFail($validated['deposit_collection_id']);
        $deposit = Deposit::find($deposit_collection->deposit_id);
        

        if(!$deposit){
            return redirect()->route('home');
        }
        $member = Member::find($deposit->member_id);
        if(!$member){
            return redirect()->route('home');
        }
        
        $deposit_amount = $validated['deposit_amount'] * 100; // convert to cents
        $previously_collected_amount = $deposit_collection->deposit_amount;

        DB::transaction(function() use($deposit_collection, $deposit_amount, $member, $previously_collected_amount) {
            // Update the deposit collection record
            $deposit_collection->deposit_amount = $deposit_amount;
            $deposit_collection->save();


            // Adjust the member's total deposit
            $member->total_deposit = $member->total_deposit - $previously_collected_amount + $deposit_amount;
            $member->save();
        });
        // return back to admin.bank.de.member_details

        return redirect()->route('admin.bank.de.member_details', [
            'member' => $member->id,
        ])->with('message', 'সঞ্চয় জমা সফলভাবে আপডেট করা হয়েছে।');

        
    }

    public function updateLoanCollection(LoanCollection $loan_collection){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home');
        }
        $loan = Loan::find($loan_collection->loan_id);
        if(!$loan){
            return redirect()->route('home');
        }
        $member = Member::find($loan->member_id);
        if(!$member){
            return redirect()->route('home');
        }
        return Inertia::render('Admin/Bank/DataEntry/DEUpdateLoanCollection', [
            'member' => $member,
            'loanCollection' => $loan_collection,
            'dataEntryMode' => $data_entry_mode,
        ]);
    }

    public function saveUpdatedLoanCollection(Request $request){
        $data_entry_mode = config('services.data_entry.mode', false);
        if(!$data_entry_mode){
            return redirect()->route('home'); 
        }

        $validated = $request->validate([
            'loan_collection_id' => 'required|exists:loan_collections,id',
            'paid_amount' => 'required|numeric|min:1',
            'last_collecting_date' => 'required|date',
        ]);
        $total_paid_amount = $validated['paid_amount'] * 100; // convert to cents
        $interest_paid = 0;
        $main_paid = 0;

        $loan_collection = LoanCollection::findOrFail($validated['loan_collection_id']);
        $loan = Loan::find($loan_collection->loan_id);
        if(!$loan){
            return redirect()->route('home');
        }
        $member = Member::find($loan->member_id);
        if(!$member){
            return redirect()->route('home');
        }
        $previously_paid_interest = $loan_collection->interest_paid_amount;
        $previously_paid_main = $loan_collection->main_paid_amount;
        $previously_paid_total = $loan_collection->paid_amount;

        $total_days_between_after_loan_creation_and_last_collecting = Carbon::parse($loan->created_at)->diffInDays(Carbon::parse($validated['last_collecting_date']));

        if($total_paid_amount >= $previously_paid_interest){
            $interest_paid = $previously_paid_interest;
            $main_paid = $total_paid_amount - $interest_paid;
        } else{
            $interest_paid = $total_paid_amount;
            $main_paid = 0;
        }

        DB::transaction(function () use(
            $loan_collection, 
            $total_paid_amount, 
            $main_paid, 
            $interest_paid, 
            $loan, 
            $previously_paid_main, 
            $previously_paid_interest,
            $validated,
        ){
             //update the LoanCollection instance
            $loan_collection->paid_amount = $total_paid_amount;
            $loan_collection->main_paid_amount = $main_paid;
            $loan_collection->interest_paid_amount = $interest_paid;
            $loan_collection->paying_date = $validated['last_collecting_date'];
            $loan_collection->created_at = Carbon::parse($validated['last_collecting_date'])->startOfDay();
            $loan_collection->updated_at = today();
            $loan_collection->save();

            // update the Loan instance
            $loan->remaining_payable_main = $loan->remaining_payable_main + $previously_paid_main - $main_paid;
            $loan->remaining_payable_interest = $loan->remaining_payable_interest + $previously_paid_interest - $interest_paid;
            $loan->save();
        });
       
        return redirect()->route('admin.bank.de.member_details', [
            'member' => $member->id,
        ])->with('message', 'কিস্তি সফলভাবে আপডেট করা হয়েছে।');
    }

  

}