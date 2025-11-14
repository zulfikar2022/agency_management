<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Step 1: Update existing data to lowercase
        DB::statement("UPDATE customers SET collection_day = LOWER(collection_day)");

        // Step 2: Modify the ENUM column to use lowercase values
        DB::statement("
            ALTER TABLE customers 
            MODIFY COLUMN collection_day ENUM(
                'sunday', 'monday', 'tuesday', 'wednesday', 
                'thursday', 'friday', 'saturday'
            ) NOT NULL
        ");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Step 1: Convert back to capitalized
        DB::statement("UPDATE customers SET collection_day = CONCAT(UPPER(LEFT(collection_day, 1)), SUBSTRING(collection_day, 2))");

        // Step 2: Revert ENUM to original capitalized values
        DB::statement("
            ALTER TABLE customers 
            MODIFY COLUMN collection_day ENUM(
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                'Thursday', 'Friday', 'Saturday'
            ) NOT NULL
        ");
        });
    }
};
