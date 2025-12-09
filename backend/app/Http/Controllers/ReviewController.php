<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

class ReviewController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['success' => true, 'data' => $review], 201);
    }

    public function index($productId)
    {

        $product = Product::where('product_id', $productId)->orWhere('id', $productId)->firstOrFail();

        $reviews = Review::with('user:id,name')
            ->where('product_id', $product->id)
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $reviews]);
    }
}