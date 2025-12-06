<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // Get wishlist of logged-in user
    public function index(Request $request)
    {
        $items = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($items);
    }

    public function store(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,product_id', // <- use product_id column, not id
        ]);

        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in wishlist'], 409);
        }

        $item = Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json($item, 201);
    }


    // Remove from wishlist
    public function destroy($id)
    {
        $item = Wishlist::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }
}
