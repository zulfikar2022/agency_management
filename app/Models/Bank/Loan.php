<?php

namespace App\Models\Bank;

use App\Models\User;
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

        public function creator()
        {
            // 1st param: related model
            // 2nd param: foreign key in deposit_collections table
            // 3rd param: primary key in users table
            return $this->belongsTo(User::class, 'creating_user_id', 'id');
        }
}
