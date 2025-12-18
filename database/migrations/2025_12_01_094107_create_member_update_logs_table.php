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
        Schema::create('member_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('updating_user_id')->constrained('users')->onDelete('cascade');
            $table->string('name_before_update');
            $table->string('name_after_update');
            $table->string('address_before_update');
            $table->string('address_after_update');
            $table->string('nid_number_before_update');
            $table->string('nid_number_after_update');
            $table->string('fathers_name_before_update');
            $table->string('fathers_name_after_update');
            $table->string('mothers_name_before_update');
            $table->string('mothers_name_after_update');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_update_logs');
    }
};
