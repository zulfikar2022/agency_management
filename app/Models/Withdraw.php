<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdraw extends Model
{
    protected $fillable = [
        'member_id',
        'deposit_id',
        'withdrawing_user_id',
        'withdraw_amount',
    ];
}
