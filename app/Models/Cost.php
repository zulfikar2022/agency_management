<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cost extends Model
{
    protected $fillable = ['amount', 'description'];

    public function creator()
    {
        // The 2nd argument is your custom foreign key
        // The 3rd argument is the primary key on the users table
        return $this->belongsTo(User::class, 'creating_user_id', 'id');
    }
}
