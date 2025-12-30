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
        Schema::create('cost_update_logs', function (Blueprint $table) {
            $table->id();
            // creating_user_id, cost_id, amount_before_update, amount_after_update, description_before_update, description_after_update, is_deleted,
            $table->foreignId('creating_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cost_id')->constrained('costs')->onDelete('cascade');
            $table->integer('amount_before_update')->unsigned()->default(0);
            $table->integer('amount_after_update')->unsigned()->default(0);
            $table->text('description_before_update')->nullable();
            $table->text('description_after_update')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cost_update_logs');
    }
};
