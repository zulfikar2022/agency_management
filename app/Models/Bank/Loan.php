<?php

namespace App\Models\Bank;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'member_id', 
        'creating_user_id',
        'total_loan', 
        'daily_payable_main',
        'daily_payable_interest',
        'remaining_payable_interest',
        'last_paying_date',
        'remaining_payable_main',
        'total_paid', 
        'safety_money',
        'share_money',
        'loan_fee',
        'is_deleted',
    ];
}
