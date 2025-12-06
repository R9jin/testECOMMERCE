<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Get all items for a user
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Eager load product to get details
        $cartItems = Cart::with('product')
            ->where('users_id', $userId)
            ->get();

        return response()->json($cartItems);
    }

    // Add item to cart
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1'
        ]);

        // Check if item already exists in cart, if so, just add quantity
        $existingCart = Cart::where('users_id', $request->user()->id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($existingCart) {
            $existingCart->quantity += $request->input('quantity', 1);
            $existingCart->save();
            return response()->json($existingCart, 200);
        }

        // Otherwise create new entry
        $cart = Cart::create([
            'users_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'quantity' => $request->input('quantity', 1)
        ]);

        return response()->json($cart, 201);
    }

    // Update quantity
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::findOrFail($id);
        
        // Ensure user owns this cart item
        if ($cart->users_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json($cart);
    }

    // Remove a single cart item
    public function destroy(Request $request, $id)
    {
        $cart = Cart::findOrFail($id);

        if ($cart->users_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart->delete();

        return response()->json(['message' => 'Item removed']);
    }

    // Clear all items of user
    public function clear(Request $request)
    {
        Cart::where('users_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}