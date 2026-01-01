<?php

namespace App\Models\Bank;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class LoanCollection extends Model
{
        public function collector()
        {
            // 2nd param: foreign key in deposit_collections table
            // 3rd param: primary key in users table
            return $this->belongsTo(User::class, 'collecting_user_id', 'id')->orderBy('created_at', 'desc');
        }

        public function loan()
        {
            return $this->belongsTo(Loan::class, 'loan_id', 'id')->orderBy('created_at', 'desc');
        }

        public function update_logs()
        {
            return $this->hasMany(LoanCollectionUpdateLog::class, 'loan_collection_id', 'id')->orderBy('created_at', 'desc');
        }
}
