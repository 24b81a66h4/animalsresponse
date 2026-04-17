function MessageBubble({ message }) {
    const isMe = message?.isMe;

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow
                ${isMe
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-black rounded-bl-none'
                }`}
            >
                <p>{message.text}</p>

                {message.time && (
                    <span className="block text-xs mt-1 opacity-70">
                        {message.time}
                    </span>
                )}
            </div>
        </div>
    );
}

export default MessageBubble;