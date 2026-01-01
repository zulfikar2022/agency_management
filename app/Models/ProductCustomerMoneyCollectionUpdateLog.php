<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCustomerMoneyCollectionUpdateLog extends Model
{
    protected $fillable = [
        'product_customer_money_collection_id',
        'updating_at',
        'collected_amount_before',
        'collected_amount_after',
        'collectable_amount_before',
        'collectable_amount_after',
        'updating_user_id'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'updating_user_id', 'id')->orderBy('created_at', 'desc');
    }
}
