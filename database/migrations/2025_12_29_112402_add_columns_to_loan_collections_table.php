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
            $table->integer('interest_paid_amount')->after('paid_amount')->default(0);
            $table->integer('main_paid_amount')->after('interest_paid_amount')->default(0);
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
