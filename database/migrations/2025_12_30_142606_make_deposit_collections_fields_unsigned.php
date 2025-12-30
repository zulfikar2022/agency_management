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
        Schema::table('deposit_collections', function (Blueprint $table) {
            // depositable_amount, deposit_amount
            $table->integer('depositable_amount')->unsigned()->change();
            $table->integer('deposit_amount')->unsigned()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deposit_collections', function (Blueprint $table) {
            //
        });
    }
};
