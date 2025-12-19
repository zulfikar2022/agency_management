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
        Schema::table('loan_update_logs', function (Blueprint $table) {
            $table->integer('total_payable_amount_before_update')->default(0);
            $table->integer('total_payable_amount_after_update')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan_update_logs', function (Blueprint $table) {
            //
        });
    }
};
