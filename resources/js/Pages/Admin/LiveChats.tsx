import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Send, User, Clock, MessageSquare, Bot, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface Message {
    id: number;
    sender_type: 'guest' | 'admin';
    message: string;
    is_read: boolean;
    created_at: string;
}

interface ChatSession {
    id: number;
    guest_id: string;
    name: string | null;
    status: 'active' | 'closed';
    updated_at: string;
    messages: Message[];
}

export default function LiveChats({ auth, sessions: initialSessions }: any) {
    const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('/admin/live-chats', {
                headers: { Accept: 'application/json' }
            });
            if (res.data && res.data.sessions) {
                setSessions(res.data.sessions);
            }
        } catch (err) {
            // silent fail for polling
        }
    };

    const fetchMessages = async (sessionId: number) => {
        try {
            const res = await axios.get(`/app-api/admin/live-chats/${sessionId}/messages`);
            setMessages(res.data);
            scrollToBottom();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSessions();
            if (activeSessionId) {
                fetchMessages(activeSessionId);
            }
        }, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [activeSessionId]);

    useEffect(() => {
        if (activeSessionId) {
            fetchMessages(activeSessionId);
        }
    }, [activeSessionId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeSessionId) return;

        const tempMessage = inputValue;
        setInputValue('');

        try {
            await axios.post(`/app-api/admin/live-chats/${activeSessionId}/send`, {
                message: tempMessage
            });
            fetchMessages(activeSessionId);
            fetchSessions();
        } catch (err) {
            Swal.fire('Error', 'Failed to send message', 'error');
            setInputValue(tempMessage); // restore
        }
    };

    const handleCloseSession = async () => {
        if (!activeSessionId) return;

        const result = await Swal.fire({
            title: 'Close Chat?',
            text: "Are you sure you want to close this chat session?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, close it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`/app-api/admin/live-chats/${activeSessionId}/close`);
                Swal.fire('Closed!', 'The chat session has been closed.', 'success');
                setActiveSessionId(null);
                fetchSessions();
            } catch (err) {
                Swal.fire('Error', 'Failed to close session', 'error');
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Live Chats</h2>}
        >
            <Head title="Live Chats" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex h-[600px]">
                        
                        {/* Sidebar: Chat Sessions List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                            <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
                                <h3 className="font-bold text-gray-700">Active Conversations</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {sessions.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p>No active chats right now.</p>
                                    </div>
                                ) : (
                                    sessions.map(session => (
                                        <div 
                                            key={session.id} 
                                            onClick={() => setActiveSessionId(session.id)}
                                            className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${activeSessionId === session.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-900">
                                                            {session.name || `Guest #${session.id}`}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(session.updated_at).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {session.status === 'closed' && (
                                                    <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Closed</span>
                                                )}
                                                {session.status === 'active' && (
                                                    <span className="bg-green-100 text-green-600 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 truncate mt-2 pl-10">
                                                {session.messages?.[0]?.message || 'No messages yet'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Main Chat Area */}
                        <div className="flex-1 flex flex-col bg-white">
                            {activeSessionId ? (
                                <>
                                    {/* Header */}
                                    <div className="p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {activeSession?.name || `Guest Chat #${activeSession?.id}`}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    ID: {activeSession?.guest_id.substring(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                        {activeSession?.status === 'active' && (
                                            <Button variant="destructive" size="sm" onClick={handleCloseSession}>
                                                Close Chat
                                            </Button>
                                        )}
                                    </div>

                                    {/* Messages list */}
                                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                                        <div className="text-center my-4">
                                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                                Chat Started
                                            </span>
                                        </div>
                                        {messages.map((msg) => (
                                            <div 
                                                key={msg.id} 
                                                className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div 
                                                    className={`max-w-[70%] p-3 text-[14px] shadow-sm ${
                                                        msg.sender_type === 'admin' 
                                                            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                                                            : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm'
                                                    }`}
                                                >
                                                    {msg.message}
                                                    <div 
                                                        className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                                                            msg.sender_type === 'admin' ? 'text-blue-200' : 'text-gray-400'
                                                        }`}
                                                    >
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {msg.sender_type === 'admin' && (
                                                            <CheckCircle2 className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 bg-white border-t border-gray-200">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                disabled={activeSession?.status === 'closed'}
                                                placeholder={activeSession?.status === 'closed' ? "Chat session is closed" : "Type your reply..."}
                                                className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100 disabled:text-gray-500"
                                            />
                                            <Button 
                                                type="submit" 
                                                disabled={!inputValue.trim() || activeSession?.status === 'closed'}
                                                className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Send
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500 flex-col bg-slate-50">
                                    <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                                    <p className="text-lg">Select a conversation to start chatting</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
