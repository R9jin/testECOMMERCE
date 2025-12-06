<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ✅ add this

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; // ✅ add HasApiTokens here

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'gender',
        'dob',
        'role',
        'isAdmin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relationships
    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
