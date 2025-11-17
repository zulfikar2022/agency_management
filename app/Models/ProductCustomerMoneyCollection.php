<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCustomerMoneyCollection extends Model
{
    protected $fillable = [
        'customer_id',
        'collectable_amount',
        'collected_amount',
        'collecting_date',
        'collecting_user_id',
        'customer_products_id'
    ];
}
