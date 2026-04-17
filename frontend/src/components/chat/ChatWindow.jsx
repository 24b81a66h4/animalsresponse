import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

function ChatWindow({ messages = [], onSend }) {
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    // Auto scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;

        onSend(text);
        setText('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full border rounded-lg shadow-md">

            {/* Header */}
            <div className="p-3 border-b bg-gray-100 font-semibold">
                Chat
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                {messages.length === 0 && (
                    <p className="text-center text-gray-400">No messages yet</p>
                )}

                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded px-3 py-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;