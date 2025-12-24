<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepositDismissal extends Model
{
    protected $fillable = [
        'deposit_id',
        'total_remaining_deposit',
        'total_paid',
        'creating_user_id',
    ];
}
