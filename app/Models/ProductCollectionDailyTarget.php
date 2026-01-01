<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCollectionDailyTarget extends Model
{
    protected $fillable = [
        'total_collectable', 
        'day', 
        'is_deleted'
    ];
}
