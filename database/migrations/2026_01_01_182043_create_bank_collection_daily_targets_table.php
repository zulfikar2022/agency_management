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
        Schema::create('bank_collection_daily_targets', function (Blueprint $table) {
            $table->id();
            $table->integer('deposit_collectable')->unsigned()->default(0);
            $table->integer('interest_collectable')->unsigned()->default(0);
            $table->integer('main_collectable')->unsigned()->default(0);
            $table->integer('total_collectable')->unsigned()->default(0);
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_collection_daily_targets');
    }
};
