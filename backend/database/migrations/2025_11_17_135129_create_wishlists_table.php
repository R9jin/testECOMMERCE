<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Change from numeric foreignId to string that references product_id in products
            $table->string('product_id');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');

            $table->timestamps();

            $table->unique(['user_id', 'product_id']); // Prevent duplicates
        });
    }

    public function down()
    {
        Schema::dropIfExists('wishlists');
    }

};
