<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Phase;
use App\Models\Analytics;
use App\Models\Block;
use App\Models\Unit;

use App\Models\User;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $project = Project::create([
            'name' => 'Metro Paragon Residence',
            'location' => 'Jakarta, Indonesia',
            'description' => 'A premier residential complex in the heart of Jakarta.',
            'status' => 'IN_PROGRESS',
            'budget_amount' => 500000000,
            'spent_amount' => 325000000,
            'start_date' => Carbon::parse('2023-01-15'),
            'end_date' => Carbon::parse('2025-12-31'),
        ]);

        $phases = [
            ['name' => 'Foundation & Basement', 'progress' => 100, 'order' => 1],
            ['name' => 'Main Structure', 'progress' => 85, 'order' => 2],
            ['name' => 'Finishing & Interior', 'progress' => 40, 'order' => 3],
            ['name' => 'Testing & Handover', 'progress' => 0, 'order' => 4],
        ];

        foreach ($phases as $phase) {
            Phase::create([
                'project_id' => $project->id,
                'name' => $phase['name'],
                'order' => $phase['order'],
                'progress' => $phase['progress'],
                'start_date' => Carbon::parse('2023-01-15')->addMonths($phase['order'] * 3),
                'end_date' => Carbon::parse('2023-01-15')->addMonths(($phase['order'] + 1) * 3),
            ]);
        }

        $days = 30;
        $startDate = Carbon::now()->subDays($days);

        for ($i = 0; $i < $days; $i++) {
            $date = clone $startDate;
            $date->addDays($i);
            Analytics::create([
                'project_id' => $project->id,
                'date' => $date,
                'workers_on_site' => rand(50, 150),
                'safety_incidents' => rand(0, 3),
                'quality_score' => rand(70, 100),
                'overall_progress' => 40 + floor(($i / $days) * 25),
                'daily_cost' => rand(1000, 5000),
                'daily_revenue' => rand(2000, 6000),
                'equipment_usage' => rand(60, 90),
                'defect_count' => rand(0, 5),
            ]);
        }

        // Seed Blocks and Units
        $blocks = ['A', 'B', 'C'];
        $types = [
            ['type' => 'Type 36/60', 'land' => 60, 'building' => 36, 'price' => 350000000],
            ['type' => 'Type 45/72', 'land' => 72, 'building' => 45, 'price' => 480000000],
            ['type' => 'Type 60/90', 'land' => 90, 'building' => 60, 'price' => 650000000],
        ];

        $phase = Phase::where('project_id', $project->id)->first();

        foreach ($blocks as $blockName) {
            $block = Block::create([
                'project_id' => $project->id,
                'phase_id' => $phase->id,
                'name' => 'Block ' . $blockName,
                'block_code' => $blockName,
            ]);

            for ($i = 1; $i <= 5; $i++) {
                $type = $types[array_rand($types)];
                
                // Randomly decide if this unit should be reserved/sold
                $randStatus = rand(1, 100);
                $saleStatus = 'AVAILABLE';
                $progress = rand(0, 100);
                
                if ($randStatus <= 20) {
                    $saleStatus = 'RESERVED';
                } elseif ($randStatus <= 40) {
                    $saleStatus = 'SOLD';
                }

                $unit = Unit::create([
                    'block_id' => $block->id,
                    'project_id' => $project->id,
                    'unit_code' => $blockName . '-' . str_pad($i, 2, '0', STR_PAD_LEFT),
                    'unit_type' => $type['type'],
                    'floor' => 1,
                    'price' => $type['price'],
                    'land_area' => $type['land'],
                    'building_area' => $type['building'],
                    'description' => 'Beautiful ' . $type['type'] . ' house in ' . $block->name,
                    'sale_status' => $saleStatus,
                    'progress' => $progress,
                    'status' => $progress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
                ]);

                // Create dummy SPR if reserved or sold
                if ($saleStatus !== 'AVAILABLE') {
                    $user = User::first(); // Just attach to the first user (admin) for demo
                    
                    // Spr::create([
                    //     'user_id' => $user->id,
                    //     'unit_id' => $unit->id,
                    //     'project_id' => $project->id,
                    //     'project_name' => $project->name,
                    //     'buyer_name' => 'Budi Dummy ' . $blockName . $i,
                    //     'buyer_ktp' => '320123456789' . rand(1000, 9999),
                    //     'buyer_contact' => '0812' . rand(10000000, 99999999),
                    //     'buyer_email' => 'budi' . $blockName . $i . '@example.com',
                    //     'buyer_address' => 'Jl. Dummy Residence No. ' . $i,
                    //     'buyer_job' => 'Pegawai Swasta',
                    //     'buyer_income' => rand(10, 25) * 1000000,
                    //     'unit_block' => $block->name,
                    //     'unit_number' => $unit->unit_code,
                    //     'house_type' => $unit->unit_type,
                    //     'land_area' => $unit->land_area,
                    //     'building_area' => $unit->building_area,
                    //     'price' => $unit->price,
                    //     'payment_scheme' => ['CASH', 'KPR', 'INSTALLMENT'][rand(0, 2)],
                    //     'status' => $saleStatus === 'RESERVED' ? 'SUBMITTED' : 'APPROVED',
                    //     'booking_fee' => 5000000,
                    // ]);

                    $unit->update([
                        'buyer_name' => 'Budi Dummy ' . $blockName . $i,
                        'buyer_email' => 'budi' . $blockName . $i . '@example.com',
                        'buyer_phone' => '0812' . rand(10000000, 99999999),
                    ]);
                }
            }
        }
    }
}
