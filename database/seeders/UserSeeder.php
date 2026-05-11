<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'tuhuwkwk@gmail.com'],
            [
                'name' => 'Tuhu Pangestu',
                'password' => Hash::make('tuhu.tuhu'),
                'email_verified_at' => now(),
                'is_admin' => true
            ]
        );
    }
}
