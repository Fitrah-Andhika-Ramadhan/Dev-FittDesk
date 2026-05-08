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
            ['email' => 'admin@natagroup.com'],
            [
                'name' => 'Super Admin',
                'role' => 'SUPER_ADMIN',
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
