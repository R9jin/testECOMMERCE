<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;

class OrderController extends Controller
{
    // View order history
    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    // Create new order from cart
    public function store(Request $request)
    {
        // ✅ FIX: Use 'users_id' to match your database column name for the Cart table
        $cartItems = Cart::where('users_id', auth()->id())->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 400);
        }

        // Create the order
        $order = Order::create([
            'user_id' => auth()->id(),
            'total_price' => $cartItems->sum(fn($i) => $i->product->price * $i->quantity),
            'status' => 'Pending'
        ]);

        // Add order items
        foreach ($cartItems as $cart) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cart->product_id,
                'quantity' => $cart->quantity,
                'price' => $cart->product->price
            ]);
        }

        // ✅ FIX: Use 'users_id' here as well to clear the cart
        Cart::where('users_id', auth()->id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'data' => $order
        ]);
    }

    // Track a single order
    public function show($id)
    {
        $order = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}