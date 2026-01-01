<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone_number',
        'address',
        'collection_day',
        'nid_number',
        'fathers_name',
        'mothers_name',
    ];


    public function purchases(){
        return $this->hasMany(CustomerProduct::class, 'customer_id','id')->where('is_deleted', false)->where('remaining_payable_price', '>', 0);
    }
}
