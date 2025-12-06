<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WishlistController;

// Tasks
Route::apiResource('tasks', TaskController::class);

// Public product endpoints
Route::resource('products', ProductController::class)->only(['index', 'show']);
// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::post('/products/restore', [ProductController::class, 'restore']);

    // Wishlist
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);// Make sure this is above the destroy route if conflicting, or use distinct name
    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);

    // Authenticated user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
