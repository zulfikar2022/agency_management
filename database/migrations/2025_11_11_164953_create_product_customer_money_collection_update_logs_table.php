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
        Schema::create('product_customer_money_collection_update_logs', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('product_customer_money_collection_id');

           $table->foreign('product_customer_money_collection_id', 'pcm_collection_id_fk')
            ->references('id')
            ->on('product_customer_money_collections')
            ->onDelete('cascade');


            // updating_at (date)
            $table->date('updating_at')->useCurrent();
            // collected_amount_before
            $table->integer('collected_amount_before')->default(0);
            // collected_amount_after
            $table->integer('collected_amount_after')->default(0);

            // collectable_amount_before
            $table->integer('collectable_amount_before')->default(0);
            // collectable_amount_after
            $table->integer('collectable_amount_after')->default(0);
            
            // comment
            $table->text('comment')->nullable();

            // updating_user_id
            $table->foreignId('updating_user_id');
            $table->foreign('updating_user_id', 'updating_user_fk')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');



            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_customer_money_collection_update_logs');
    }
};
