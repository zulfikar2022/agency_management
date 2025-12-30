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
        Schema::table('deposit_dismissals', function (Blueprint $table) {
            // total_collected_deposit, total_remaining_deposit, total_paid
            $table->integer('total_collected_deposit')->unsigned()->change();
            $table->integer('total_remaining_deposit')->unsigned()->change();
            $table->integer('total_paid')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deposit_dismissals', function (Blueprint $table) {
            //
        });
    }
};
