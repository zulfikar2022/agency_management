<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerProduct extends Model
{
    protected $fillable = [
        'user_id',
        'customer_id',
        'product_id',
        'quantity',
        'total_payable_price',
        'downpayment',
        'weekly_payable_price',
    ];
}
