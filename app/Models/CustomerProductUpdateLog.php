<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerProductUpdateLog extends Model
{
    protected $fillable = [
        'customer_product_id',
        'quantity_before', 
        'quantity_after',
        'total_payable_price_before',
        'total_payable_price_after',
        'downpayment_before',
        'downpayment_after',
        'weekly_payable_price_before',
        'weekly_payable_price_after',
        'updating_user_id',
    ];
}
