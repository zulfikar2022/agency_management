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

    public function creator()
    {
        return $this->belongsTo(User::class, 'collecting_user_id', 'id')->orderBy('created_at', 'desc');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id')->orderBy('created_at', 'desc');
    }

    public function update_logs()
    {
        return $this->hasMany(ProductCustomerMoneyCollectionUpdateLog::class, 'product_customer_money_collection_id', 'id')->orderBy('created_at', 'desc');
    }
}
