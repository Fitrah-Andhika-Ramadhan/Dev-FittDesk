<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@fittdesk.com'],
            [
                'name'     => 'Super Admin',
                'role'     => 'SUPER_ADMIN',
                'password' => bcrypt('password'),
            ]
        );

        // Demo accounts (dev only)
        User::firstOrCreate(
            ['email' => 'admin2@fittdesk.com'],
            [
                'name'     => 'Admin Demo',
                'role'     => 'ADMIN',
                'password' => bcrypt('password'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@fittdesk.com'],
            [
                'name'     => 'User Demo',
                'role'     => 'USER',
                'password' => bcrypt('password'),
            ]
        );

        $this->call([
            ProjectSeeder::class,
            HelpdeskSeeder::class,
            BugSeeder::class,
        ]);
    }
}
