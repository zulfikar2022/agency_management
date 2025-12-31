<?php

namespace App\Http\Controllers;

use App\Models\Cost;
use App\Models\CostUpdateLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

class CostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $start_date = request()->query('start_date', Carbon::today()->toDateString());
        $end_date = request()->query('end_date', Carbon::today()->toDateString());
        
        $costs = Cost::with('creator')
            ->where('is_deleted', false)
            ->whereDate('created_at', '>=', $start_date)
            ->whereDate('created_at', '<=', $end_date)
            ->orderBy('created_at', 'desc')
            ->get();
        foreach ($costs as $cost) {
            $cost->creating_user_name = $cost->creator ? $cost->creator->name : 'Unknown';
            $cost->creating_user_id = $cost->creator ? $cost->creator->id : null;
            // I want to not to send the creator relation to the frontend
            unset($cost->creator);
            $updates = CostUpdateLog::where('is_deleted', false)->where('cost_id', $cost->id)->orderBy('created_at', 'desc')->get();
            $cost->updates = $updates;
        }

        
        return Inertia::render('Admin/ShowCosts', ['costs' => $costs, 'start_date' => $start_date, 'end_date' => $end_date, 'user_id' => Auth::id()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/CreateCost');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // amount must be positive or 0
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $cost = new Cost();
        $cost->amount = $validated['amount'];
        $cost->description = $validated['description'] ?? '';
        $cost->creating_user_id = Auth::id();
        $cost->save();
        return redirect()->route('admin.showCosts');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cost $cost)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cost $cost)
    {
        return Inertia::render('Admin/EditCost', ['cost' => $cost]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'cost_id' => 'required|exists:costs,id',
            // amount must be positive or 0
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $today = Carbon::today()->toDateString();
        $cost_creating_date = Carbon::parse(Cost::find($validated['cost_id'])->created_at)->toDateString();
        if ($cost_creating_date != $today) {
            return redirect()->back()->withErrors(['error' => 'শুধুমাত্র আজকের তারিখের খরচ আপডেট করা যাবে।']);
        }

        

        $cost = Cost::findOrFail($validated['cost_id']);
        if($cost->is_deleted){
            return redirect()->back()->withErrors(['error' => 'এই খরচটি মুছে ফেলা হয়েছে, তাই এটি আপডেট করা যাবে না।']);
        }

        if($cost->creating_user_id != Auth::id()){
            return redirect()->back()->withErrors(['error' => 'আপনি শুধুমাত্র আপনার তৈরি করা খরচই আপডেট করতে পারবেন।']);
        }

         // Log the update before making changes

        $log = new CostUpdateLog();
        $log->creating_user_id = Auth::id();
        $log->cost_id = $validated['cost_id'];
        $log->amount_before_update = $cost->amount;
        $log->description_before_update = $cost->description;
        $log->amount_after_update = $validated['amount'];
        $log->description_after_update = $validated['description'] ?? '';
        $log->save();

        
        $cost->amount = $validated['amount'];
        $cost->description = $validated['description'] ?? '';
        $cost->save();
        return redirect()->route('admin.showCosts');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cost $cost)
    {
        //
    }

    public function generateCostDetailsReport(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $start_date = $validated['start_date'];
        $end_date = $validated['end_date'];
        $costs = Cost::with('creator')
            ->where('is_deleted', false)
            ->whereDate('created_at', '>=', $start_date)
            ->whereDate('created_at', '<=', $end_date)
            ->orderBy('created_at', 'desc')
            ->get();

        // dd($costs);
        $total_cost = 0;
        foreach ($costs as $cost) {
            $total_cost += $cost->amount;
            $cost->creating_user_name = $cost->creator ? $cost->creator->name : 'Unknown';
            // I want to not to send the creator relation to the frontend
            unset($cost->creator);
        }

        $html = view('pdf.admin-cost-details-report', [
            'start_date' => $start_date,
            'end_date' => $end_date,
            'costs' => $costs,
            'total_cost' => $total_cost,
        
        ])->render();

        $pdfData = Browsershot::html($html)
                ->noSandbox()
                ->showBackground()
                ->format('A4')
                ->pdf();
        $todayDate = date('d F Y');
        $filename =  'cost_details_report_' . $todayDate . '.pdf';

        return response($pdfData, 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="' . $filename . '"');

       
    }
}
