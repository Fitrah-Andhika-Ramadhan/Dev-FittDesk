<?php

namespace App\Http\Controllers;

use App\Models\LandingContent;
use Illuminate\Http\Request;

class LandingContentController extends Controller
{
    private $defaultContent = [
        'hero' => [
            'title' => 'Technical Tech',
            'subtitle' => 'Solusi Cerdas Layanan IT Terpadu',
            'description' => 'Tingkatkan produktivitas perusahaan Anda dengan FittDesk. Platform Service Desk dan Knowledge Base all-in-one yang dirancang untuk menangani laporan masalah secara cepat, akurat, dan terukur.',
            'ctaText' => 'Ajukan Tiket Bantuan',
        ],
        'stats' => [
            'projects' => 5,
            'units' => 1200,
            'yearsExperience' => 15,
            'satisfaction' => 99,
        ],
        'about' => [
            'title' => 'Tentang FittDesk',
            'description' => 'FittDesk merupakan platform Service Desk modern yang didesain untuk menyederhanakan pelacakan isu (ticketing) dan manajemen pengetahuan IT Anda.',
            'mission' => 'Memberikan solusi layanan bantuan teknis yang andal dan transparan',
            'vision' => 'Menjadi pusat standar operasional IT terbaik di kelasnya',
        ],
    ];

    public function index()
    {
        $contents = LandingContent::all()->keyBy('section');

        $data = [
            'hero' => isset($contents['hero']) ? $contents['hero']->content : $this->defaultContent['hero'],
            'stats' => isset($contents['stats']) ? $contents['stats']->content : $this->defaultContent['stats'],
            'about' => isset($contents['about']) ? $contents['about']->content : $this->defaultContent['about'],
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function update(Request $request)
    {
        // the request might contain the entire payload
        $data = $request->all();

        if (isset($data['hero'])) {
            LandingContent::updateOrCreate(
                ['section' => 'hero'],
                ['content' => $data['hero']]
            );
        }

        if (isset($data['stats'])) {
            LandingContent::updateOrCreate(
                ['section' => 'stats'],
                ['content' => $data['stats']]
            );
        }

        if (isset($data['about'])) {
            LandingContent::updateOrCreate(
                ['section' => 'about'],
                ['content' => $data['about']]
            );
        }

        return response()->json(['success' => true]);
    }
}
