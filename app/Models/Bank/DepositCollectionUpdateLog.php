<?php

namespace App\Models\Bank;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class DepositCollectionUpdateLog extends Model
{
    //

    public function creator()
    {
        return $this->belongsTo(User::class, 'updating_user_id', 'id');
    }
}
