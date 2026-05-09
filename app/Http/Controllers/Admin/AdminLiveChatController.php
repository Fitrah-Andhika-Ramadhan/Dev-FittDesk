<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLiveChatController extends Controller
{
    public function index()
    {
        $sessions = ChatSession::with(['messages' => function($query) {
            $query->orderBy('created_at', 'desc')->limit(1);
        }])->orderBy('updated_at', 'desc')->get();

        return Inertia::render('Admin/LiveChats', [
            'sessions' => $sessions
        ]);
    }

    public function getMessages($sessionId)
    {
        $messages = ChatMessage::where('chat_session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();
            
        // Mark guest messages as read
        ChatMessage::where('chat_session_id', $sessionId)
            ->where('sender_type', 'guest')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request, $sessionId)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $message = ChatMessage::create([
            'chat_session_id' => $sessionId,
            'sender_type' => 'admin',
            'sender_id' => auth()->id(),
            'message' => $request->message,
            'is_read' => false
        ]);
        
        ChatSession::where('id', $sessionId)->update(['updated_at' => now()]);

        return response()->json($message);
    }

    public function closeSession($sessionId)
    {
        ChatSession::where('id', $sessionId)->update(['status' => 'closed']);
        return redirect()->back()->with('success', 'Chat session closed.');
    }
}
