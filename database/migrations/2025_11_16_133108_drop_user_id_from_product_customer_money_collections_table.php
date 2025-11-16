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
            Schema::table('product_customer_money_collections', function (Blueprint $table) {
            // Drop foreign key first if it exists
            $table->dropForeign(['user_id']);

            // Then drop the column
            $table->dropColumn('user_id');
        });
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_customer_money_collections', function (Blueprint $table) {
            //
        });
    }
};
