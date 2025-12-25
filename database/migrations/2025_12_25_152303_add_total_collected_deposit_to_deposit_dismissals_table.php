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
            $table->integer('total_collected_deposit')->default(0)->after('deposit_id');
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
