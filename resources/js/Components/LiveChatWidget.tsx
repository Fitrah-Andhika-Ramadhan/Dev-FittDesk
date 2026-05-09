import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Button } from './ui/button';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Halo! Ada yang bisa kami bantu seputar layanan FittDesk?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse: Message = {
                id: Date.now() + 1,
                text: 'Terima kasih atas pesannya! Tim support kami akan segera merespons Anda. Silakan tinggalkan email Anda jika ingin dihubungi lebih lanjut.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            <div className={`absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto h-[450px]' : 'scale-90 opacity-0 pointer-events-none h-0'}`}>
                {/* Header */}
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-inner">
                                <Bot className="w-6 h-6 text-blue-50" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600"></div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">FittDesk Support</h3>
                            <p className="text-xs text-blue-100">Online | Siap membantu</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-blue-100 hover:text-white transition-colors p-1 rounded-full hover:bg-blue-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div 
                                className={`max-w-[85%] p-3 text-[14px] leading-relaxed shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm'
                                }`}
                            >
                                {msg.text}
                                <div 
                                    className={`text-[10px] mt-1.5 text-right font-medium ${
                                        msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                                    }`}
                                >
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
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
