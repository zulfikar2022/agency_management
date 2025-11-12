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
        Schema::create('customer_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('name_before');
            $table->string('name_after');

            $table->string('address_before');
            $table->string('address_after');

            //phone_number_before
            $table->string('phone_number_before');
            $table->string('phone_number_after');

            // collection_day_before
            $table->enum('collection_day_before', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
            $table->enum('collection_day_after', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);


            // nid_number_before
            $table->string('nid_number_before')->nullable();
            $table->string('nid_number_after')->nullable();

            // fathers_name_before
            $table->string('fathers_name_before')->nullable();
            $table->string('fathers_name_after')->nullable();

            // mothers_name_before
            $table->string('mothers_name_before')->nullable();
            $table->string('mothers_name_after')->nullable();


            $table->foreignId('updating_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_update_logs');
    }
};
