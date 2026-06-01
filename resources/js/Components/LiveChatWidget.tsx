import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, UserRound } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: number;
    message: string;
    sender_type: 'guest' | 'admin';
    sender_id?: string | null;
    created_at: string;
}

export function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [chatMode, setChatMode] = useState<'ai' | 'admin'>('ai');
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 0,
            message: 'Halo! Ada yang bisa kami bantu seputar layanan FittDesk?',
            sender_type: 'admin',
            sender_id: null,
            created_at: new Date().toISOString()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Init chat session when opening for the first time
    useEffect(() => {
        if (isOpen && !sessionId) {
            const guestId = localStorage.getItem('fittdesk_guest_id') || '';
            axios.post('/app-api/chat/init', { guest_id: guestId })
                .then(res => {
                    setSessionId(res.data.session_id);
                    localStorage.setItem('fittdesk_guest_id', res.data.guest_id);
                    fetchMessages(res.data.session_id);
                })
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    // Poll messages every 3 seconds if session is active
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen && sessionId) {
            interval = setInterval(() => {
                fetchMessages(sessionId);
            }, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isOpen, sessionId]);

    const fetchMessages = async (sid: number) => {
        try {
            const res = await axios.get(`/app-api/chat/messages/${sid}`);
            if (res.data && res.data.length > 0) {
                // Add initial bot greeting if no messages yet
                setMessages([
                    {
                        id: 0,
                        message: 'Halo! Ada yang bisa kami bantu seputar layanan FittDesk?',
                        sender_type: 'admin',
                        sender_id: null,
                        created_at: new Date().toISOString()
                    },
                    ...res.data
                ]);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, isOpen, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !sessionId) return;

        const tempMsg = inputValue;
        setInputValue('');

        // Optimistic update
        setMessages(prev => [...prev, {
            id: Date.now(),
            message: tempMsg,
            sender_type: 'guest',
            created_at: new Date().toISOString()
        }]);

        try {
            setIsLoading(true);
            await axios.post('/app-api/chat/send', {
                session_id: sessionId,
                message: tempMsg,
                chat_mode: chatMode
            });
            await fetchMessages(sessionId);
        } catch (error) {
            console.error('Failed to send message', error);
            setInputValue(tempMsg); // restore on failure
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            <div className={`absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto h-[450px]' : 'scale-90 opacity-0 pointer-events-none h-0'}`}>
                {/* Header */}
                <div className="bg-blue-600 p-4 flex flex-col gap-3 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-inner">
                                    {chatMode === 'ai' ? <Bot className="w-6 h-6 text-blue-50" /> : <UserRound className="w-6 h-6 text-blue-50" />}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">FittDesk Support</h3>
                                <p className="text-xs text-blue-100">Online | {chatMode === 'ai' ? 'AI Assistant' : 'Admin Support'}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white transition-colors p-1 rounded-full hover:bg-blue-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Mode Toggle */}
                    <div className="flex items-center justify-center bg-blue-700/50 p-1 rounded-lg">
                        <button
                            onClick={() => setChatMode('ai')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                                chatMode === 'ai' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-200 hover:text-white'
                            }`}
                        >
                            <Bot className="w-3.5 h-3.5" /> AI Mode
                        </button>
                        <button
                            onClick={() => setChatMode('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                                chatMode === 'admin' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-200 hover:text-white'
                            }`}
                        >
                            <UserRound className="w-3.5 h-3.5" /> Admin Mode
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.sender_type === 'guest' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div 
                                className={`max-w-[85%] p-3 text-[14px] leading-relaxed shadow-sm ${
                                    msg.sender_type === 'guest' 
                                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm'
                                }`}
                            >
                                {msg.sender_type === 'admin' && msg.sender_id === null && (
                                    <div className="flex items-center gap-1 text-[11px] text-blue-500 mb-1 font-semibold">
                                        <Bot className="w-3 h-3" /> AI Assistant
                                    </div>
                                )}
                                <ReactMarkdown 
                                    className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-p:mb-2 prose-p:mt-0 prose-ul:my-1 prose-ol:my-1 break-words ${
                                        msg.sender_type === 'guest' ? 'prose-invert prose-p:text-white prose-strong:text-white text-white' : 'prose-slate prose-p:text-gray-800 text-gray-800'
                                    }`}
                                >
                                    {msg.message}
                                </ReactMarkdown>
                                <div 
                                    className={`text-[10px] mt-1.5 text-right font-medium ${
                                        msg.sender_type === 'guest' ? 'text-blue-200' : 'text-gray-400'
                                    }`}
                                >
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-1.5 items-center shadow-sm">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ketik pesan Anda..."
                            className="flex-1 text-sm bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2.5 outline-none transition-all placeholder:text-gray-400"
                        />
                        <Button 
                            type="submit" 
                            size="icon"
                            disabled={!inputValue.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex-shrink-0 shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4 ml-1" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
                    isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
                aria-label="Toggle Live Chat"
            >
                <MessageSquare className="w-6 h-6" />
                {/* Notification dot */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            </button>
            
            {/* Close button when open */}
            <button
                onClick={() => setIsOpen(false)}
                className={`absolute bottom-0 right-0 bg-gray-800 hover:bg-gray-900 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                    isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0 pointer-events-none'
                }`}
                aria-label="Close Live Chat"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    );
}
