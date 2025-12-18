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
        Schema::create('withdraw_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('withdraw_id')->constrained('withdraws')->onDelete('cascade');
            $table->foreignId('updating_user_id')->constrained('users')->onDelete('cascade');
            $table->integer('withdraw_amount_before_update')->default(0);
            $table->integer('withdraw_amount_after_update')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdraw_update_logs');
    }
};
