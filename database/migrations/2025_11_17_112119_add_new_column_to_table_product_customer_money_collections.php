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
        Schema::table('product_customer_money_collections', function (Blueprint $table) {
            $table->foreignId('customer_products_id')->constrained('customer_products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_customer_money_collections', function (Blueprint $table) {
            
            $table->dropForeign(['customer_products_id']);
            $table->dropColumn('customer_products_id');
        });
    }
};
