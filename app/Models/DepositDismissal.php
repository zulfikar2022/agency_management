<?php

namespace App\Models;

use App\Models\Bank\Deposit;
use Illuminate\Database\Eloquent\Model;

class DepositDismissal extends Model
{
    protected $fillable = [
        'deposit_id',
        'total_remaining_deposit',
        'total_paid',
        'creating_user_id',
        'total_collected_deposit',
    ];

    public function deposit(){
        return $this->belongsTo(Deposit::class, 'deposit_id');
    }
}
