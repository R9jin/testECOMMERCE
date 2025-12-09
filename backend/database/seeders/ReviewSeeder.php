<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Load the JSON data
        $json = File::get(database_path('seeders/reviews.json'));
        $reviews = json_decode($json, true);

        foreach ($reviews as $data) {
            // 2. Find the product by its string ID (e.g., "AP001")
            $product = Product::where('product_id', $data['product_code'])->first();

            if (!$product) {
                // If product doesn't exist, skip
                continue;
            }

            // 3. Find or Create the User
            // We use firstOrCreate so we don't duplicate users if we run this multiple times
            $user = User::firstOrCreate(
                ['email' => $data['user_email']],
                [
                    'name' => 'Reviewer ' . explode('@', $data['user_email'])[0],
                    'password' => Hash::make('password'),
                    'phone' => '09123456789',
                    'gender' => 'Male', // Default values for required fields
                    'dob' => '2000-01-01',
                    'role' => 'user'
                ]
            );

            // 4. Create the Review
            Review::create([
                'user_id' => $user->id,
                'product_id' => $product->id, // Use the numeric ID for the foreign key
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]);
        }
    }
}