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
        Schema::create('customer_product_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_product_id')->constrained('customer_products')->onDelete('cascade');
            // quantity_before
            $table->integer('quantity_before')->default(0);
            // quantity_after
            $table->integer('quantity_after')->default(0);

            // total_payable_price_before
            $table->integer('total_payable_price_before')->default(0);
            // total_payable_price_after
            $table->integer('total_payable_price_after')->default(0);

            // weekly_payable_price_before
            $table->integer('weekly_payable_price_before')->default(0);
            // weekly_payable_price_after
            $table->integer('weekly_payable_price_after')->default(0);

            // updating_user_id
            $table->foreignId('updating_user_id')->constrained('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_product_update_logs');
    }
};
