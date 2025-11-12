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
        Schema::create('product_customer_money_collections', function (Blueprint $table) {
            $table->id();
            // customer_id 
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            // collecting_date
            $table->date('collecting_date')->useCurrent();
            // collected_amount
            $table->integer('collected_amount')->default(0);
            //collectable_amount
            $table->integer('collectable_amount')->default(0);

            // collecting_user_id
            $table->foreignId('collecting_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_customer_money_collections');
    }
};
