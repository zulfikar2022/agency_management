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
            // collected_amount, collectable_amount
            $table->integer('collected_amount')->unsigned()->change();
            $table->integer('collectable_amount')->unsigned()->change();
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
