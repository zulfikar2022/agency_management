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
        Schema::create('product_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');

            // name changes
            $table->string('name_before');
            $table->string('name_after');

            //supplier_name changes
            $table->string('supplier_name_before');
            $table->string('supplier_name_after');

            $table->integer('initial_quantity_before')->default(0);
            $table->integer('initial_quantity_after')->default(0);
            $table->integer('current_quantity_before')->default(0);
            $table->integer('current_quantity_after')->default(0);
            $table->integer('buying_price_per_product_before')->default(0);
            $table->integer('buying_price_per_product_after')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_update_logs');
    }
};
