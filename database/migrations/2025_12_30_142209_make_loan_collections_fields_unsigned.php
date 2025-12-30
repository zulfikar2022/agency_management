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
        Schema::table('loan_collections', function (Blueprint $table) {
            // paid_amount, interest_paid_amount, main_paid_amount
            $table->integer('paid_amount')->unsigned()->change();
            $table->integer('interest_paid_amount')->unsigned()->change();
            $table->integer('main_paid_amount')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_collections', function (Blueprint $table) {
            //
        });
    }
};
