<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\ChatMessage;

class AiChatService
{
    public function generateResponse($sessionId, $guestMessage)
    {
        // 1. Ambil history percakapan (misal 5 pesan terakhir)
        $history = ChatMessage::where('chat_session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->reverse()
            ->map(function ($msg) {
                return [
                    'role' => $msg->sender_type === 'guest' ? 'user' : 'assistant',
                    'content' => $msg->message
                ];
            })->values()->toArray();

        // 2. Siapkan system prompt
        $systemMessage = [
            'role' => 'system',
            'content' => "Anda adalah AI Assistant untuk FittDesk, sebuah sistem IT Helpdesk. Tugas Anda adalah merespons pertanyaan pengunjung dengan ramah, profesional, dan ringkas. Anda bisa membantu mengarahkan mereka untuk membuat tiket atau memberikan solusi dasar dari IT support. Jangan memberikan informasi palsu."
        ];

        // 3. Gabungkan pesan
        $messages = array_merge([$systemMessage], $history);

        // Pastikan pesan terbaru ada di ujung array jika history kosong
        if (empty($history)) {
            $messages[] = [
                'role' => 'user',
                'content' => $guestMessage
            ];
        }

        try {
            // 4. Request ke OpenRouter API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . trim(env('OPENROUTER_API_KEY')),
                'HTTP-Referer' => config('app.url'),
                'X-Title' => 'FittDesk'
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                // Menggunakan model gratis dari OpenRouter
                'model' => 'openrouter/free',
                'messages' => $messages,
                'max_tokens' => 1000,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['choices'][0]['message']['content'] ?? 'Maaf, saya sedang mengalami gangguan dalam memproses permintaan Anda.';
            } else {
                Log::error('OpenRouter API Error: ' . $response->body());
                return 'Maaf, sistem AI kami sedang tidak bisa diakses saat ini.';
            }
        } catch (\Exception $e) {
            Log::error('OpenRouter Exception: ' . $e->getMessage());
            return 'Maaf, sistem AI kami sedang tidak bisa diakses saat ini.';
        }
    }
}
