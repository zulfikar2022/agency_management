<?php

namespace App\Models\Bank;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class DepositCollection extends Model
{
    
    public function collector()
        {
            // 2nd param: foreign key in deposit_collections table
            // 3rd param: primary key in users table
            return $this->belongsTo(User::class, 'collecting_user_id', 'id');
        }
}
