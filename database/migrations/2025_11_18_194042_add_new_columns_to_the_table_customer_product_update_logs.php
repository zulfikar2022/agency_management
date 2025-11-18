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
        Schema::table('customer_product_update_logs', function (Blueprint $table) {
            $table->integer('remaining_payable_price_before')->nullable();
            $table->integer('remaining_payable_price_after')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_product_update_logs', function (Blueprint $table) {
            //
        });
    }
};
