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

     public function creator()
    {
        // The 2nd argument is your custom foreign key
        // The 3rd argument is the primary key on the users table
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
