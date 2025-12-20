<?php

namespace App\Models\Bank;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'member_id',
        'creating_user_id',
        'total_loan',
        'safety_money',
        'total_payable_amount',
        'remaining_payable_amount',
        'share_money',
        'loan_fee',
        'daily_payable_amount',
        'is_deleted',
        'last_paying_date',
    ];
}
