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

      public function creator()
        {
            // 1st param: related model
            // 2nd param: foreign key in deposit_collections table
            // 3rd param: primary key in users table
            return $this->belongsTo(User::class, 'withdrawing_user_id', 'id');
        }
}
