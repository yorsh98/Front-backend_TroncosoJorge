<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->updateOrCreate(
            ['email' => 'admin@proviemplea.local'],
            [
                'name' => 'Super Administrador',
                'password' => 'password',
            ],
        );

        $user->assignRole('superadmin');
    }
}
