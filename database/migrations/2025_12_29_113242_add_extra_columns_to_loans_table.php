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
        Schema::table('loans', function (Blueprint $table) {
            $table->integer('daily_payable_main')->after('total_loan')->default(0);
            $table->integer('daily_payable_interest')->after('daily_payable_main')->default(0);
            $table->integer('remaining_payable_interest')->after('daily_payable_interest')->default(0);
            
            $table->integer('total_paid')->after('remaining_payable_main')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropColumn(['daily_payable_main', 'daily_payable_interest', 'remaining_payable_interest', 'remaining_payable_main', 'total_paid']);
        });
    }
};
