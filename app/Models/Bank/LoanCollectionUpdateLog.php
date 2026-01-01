<?php

namespace App\Models\Bank;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class LoanCollectionUpdateLog extends Model
{
    
    public function creator()
    {
        // 2nd param: foreign key in loan_collection_update_logs table
        // 3rd param: primary key in users table
        return $this->belongsTo(User::class, 'updating_user_id', 'id')->orderBy('created_at', 'desc');
    }
}
