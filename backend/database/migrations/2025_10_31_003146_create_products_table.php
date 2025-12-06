<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_id')->unique();
            $table->string('name');
            $table->enum('category', ['Appetizers', 'Main Course', 'Desserts', 'Street Food', 'Drinks']);
            $table->decimal('price', 8, 2);
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('stock')->default(0);
            $table->integer('sold')->default(0);
            $table->boolean('wishlisted')->default(false);
            $table->date('dateAdded')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
