<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Database\Seeders\ProductSeeder;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Product::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Appetizers,Main Course,Desserts,Street Food,Drinks',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'stock' => 'required|integer',
            'sold' => 'nullable|integer|min:0',
            'wishlisted' => 'nullable|boolean',
            'dateAdded' => 'nullable|date',
        ]);

        $validated['product_id'] = 'P-' . uniqid();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        $product = Product::create($validated);

        return response()->json(['success' => true, 'data' => $product], 201);
    }

    public function show(Product $product)
    {
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:Appetizers,Main Course,Desserts,Street Food,Drinks',
            'price' => 'sometimes|numeric',
            'image' => 'sometimes|image|max:2048',
            'description' => 'sometimes|string',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'stock' => 'sometimes|integer',
            'sold' => 'sometimes|integer|min:0',
            'wishlisted' => 'sometimes|boolean',
            'dateAdded' => 'sometimes|date',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        $product->update($validated);
        $product->refresh();
        return response()->json(['success' => true, 'data' => $product]);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['success' => true, 'message' => 'Product deleted']);
    }

    public function restore()
    {
        // 1. Delete all existing products (Cascade will remove them from carts/wishlists)
        Product::query()->delete();

        // 2. Run the ProductSeeder to insert defaults from JSON
        $seeder = new ProductSeeder();
        $seeder->run();

        return response()->json([
            'success' => true, 
            'message' => 'Products restored to default settings.'
        ]);
    }
}
