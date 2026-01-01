<?php

namespace App\Models\Bank;

use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    
    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id', 'id')->orderBy('created_at', 'desc');
    }
}
