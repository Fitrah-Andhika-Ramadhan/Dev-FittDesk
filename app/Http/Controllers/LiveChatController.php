<?php

namespace App\Http\Controllers;

use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Services\AiChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LiveChatController extends Controller
{
    public function init(Request $request)
    {
        $guestId = $request->input('guest_id');
        if (!$guestId) {
            $guestId = Str::uuid()->toString();
        }

        $session = ChatSession::firstOrCreate(
            ['guest_id' => $guestId],
            ['status' => 'active']
        );

        return response()->json([
            'session_id' => $session->id,
            'guest_id' => $guestId,
            'status' => $session->status
        ]);
    }

    public function getMessages(Request $request, $sessionId)
    {
        $messages = ChatMessage::where('chat_session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:chat_sessions,id',
            'message' => 'required|string'
        ]);

        $message = ChatMessage::create([
            'chat_session_id' => $request->session_id,
            'sender_type' => 'guest',
            'message' => $request->message,
            'is_read' => false
        ]);

        // --- Panggil AI Chatbot ---
        $aiService = new AiChatService();
        $aiResponseText = $aiService->generateResponse($request->session_id, $request->message);

        // Simpan balasan AI
        $aiMessage = ChatMessage::create([
            'chat_session_id' => $request->session_id,
            'sender_type' => 'admin',
            'sender_id' => null, // AI Assistant
            'message' => $aiResponseText,
            'is_read' => false
        ]);

        return response()->json([
            'guest_message' => $message,
            'ai_message' => $aiMessage
        ]);
    }
}
