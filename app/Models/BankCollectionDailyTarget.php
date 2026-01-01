<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankCollectionDailyTarget extends Model
{

    protected $fillable = [
        'deposit_collectable',
        'interest_collectable', 
        'main_collectable',
        'total_loan_collectable',
    ];
}
