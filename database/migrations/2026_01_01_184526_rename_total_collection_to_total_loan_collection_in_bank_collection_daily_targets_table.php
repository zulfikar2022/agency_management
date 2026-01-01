<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_collection_daily_targets', function (Blueprint $table) {
            // Renaming the column
            $table->renameColumn('total_collectable', 'total_loan_collectable');
        });
    }

    public function down(): void
    {
        Schema::table('bank_collection_daily_targets', function (Blueprint $table) {
            // Reverting the name if we rollback
            $table->renameColumn('total_loan_collectable', 'total_collectable');
        });
    }
};

