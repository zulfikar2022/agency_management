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
            // downpayment_before
            $table->integer('downpayment_before')->default(0)->after('weekly_payable_price_after');
            // downpayment_after
            $table->integer('downpayment_after')->default(0)->after('downpayment_before');
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
