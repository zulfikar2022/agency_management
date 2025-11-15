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
            // remaining_payable_price column which will be positive integer and default value 0
            $table->unsignedInteger('remaining_payable_price')->default(0)->after('weekly_payable_price');
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
