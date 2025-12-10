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
        Schema::create('loan_collection_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_collection_id')->constrained('loan_collections');
            $table->foreignId('updating_user_id')->constrained('users');
            $table->integer('paid_amount_before_update');
            $table->integer('paid_amount_after_update');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_collection_update_logs');
    }
};
