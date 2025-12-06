<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $usersFile = database_path('seeders/users.json');

        if (!file_exists($usersFile)) {
            $this->command->info('users.json file not found in seeders folder.');
            return;
        }

        $users = json_decode(file_get_contents($usersFile), true);

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']), // hash password
                    'phone' => $user['phone'],
                    'gender' => $user['gender'],
                    'dob' => $user['dob'],
                    'role' => $user['role'] ?? 'user',
                    'isAdmin' => $user['isAdmin'] ?? false,
                ]
            );
        }
    }
}
