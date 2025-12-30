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
            // $table->integer('amount')->unsigned()->change();
            // $table->integer('interest_rate')->unsigned()->change();
            $table->integer('total_loan')->unsigned()->change();
            // daily_payable_main, daily_payable_interest, remaining_payable_main, remaining_payable_interest,total_paid, safety_money, share_money, loan_fee
            $table->integer('daily_payable_main')->unsigned()->change();
            $table->integer('daily_payable_interest')->unsigned()->change();
            $table->integer('remaining_payable_main')->unsigned()->change();
            $table->integer('remaining_payable_interest')->unsigned()->change();
            $table->integer('total_paid')->unsigned()->change();
            $table->integer('safety_money')->unsigned()->change();
            $table->integer('share_money')->unsigned()->change();
            $table->integer('loan_fee')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
           //
        });
    }
};
