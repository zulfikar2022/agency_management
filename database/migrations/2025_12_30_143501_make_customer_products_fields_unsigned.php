<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customer_products', function (Blueprint $table) {
            // quantity, total_payable_price, downpayment, weekly_payable_price, remaining_payable_price
            $table->integer('quantity')->unsigned()->change();
            $table->integer('total_payable_price')->unsigned()->change();   
            $table->integer('downpayment')->unsigned()->change();
            $table->integer('weekly_payable_price')->unsigned()->change();
            $table->integer('remaining_payable_price')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_products', function (Blueprint $table) {
            //
        });
    }
};
