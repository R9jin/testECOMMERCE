<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\DB; // Import DB for transactions

class OrderController extends Controller
{
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

    public function store(Request $request)
    {

        return DB::transaction(function () use ($request) {
            $user = auth()->user();
            
            $cartItems = Cart::where('users_id', $user->id)->with('product')->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
            }

            $totalAmount = 0;

            foreach ($cartItems as $item) {
                if ($item->product->stock < $item->quantity) {
                    return response()->json([
                        'success' => false, 
                        'message' => "Insufficient stock for product: " . $item->product->name
                    ], 400);
                }
                $totalAmount += $item->product->price * $item->quantity;
            }

            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $totalAmount,
                'status' => 'Pending',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price
                ]);

                $item->product->decrement('stock', $item->quantity);
                $item->product->increment('sold', $item->quantity);
            }

            Cart::where('users_id', $user->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order
            ]);
        });
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

    // Update order status
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $order = Order::where('user_id', auth()->id())->findOrFail($id);
        
        $order->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'data' => $order
        ]);
    }
}