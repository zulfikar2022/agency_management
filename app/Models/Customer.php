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
}
