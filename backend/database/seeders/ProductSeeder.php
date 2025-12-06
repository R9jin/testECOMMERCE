<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = json_decode(file_get_contents(database_path('seeders/products.json')), true);

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
