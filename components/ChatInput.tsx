import React, { useState } from 'react';

interface ChatInputProps {
    onSend: (text: string) => void;
    isLoading: boolean;
}

const SendIcon = ({ className }: { className: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [text, setText] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSend(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSend} className="p-4 bg-[#1C1C1C] border-t-2 border-[#3A3A3A] flex-shrink-0">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Review 'Q3 Budget Proposal'..."
                    disabled={isLoading}
                    className="w-full p-3 bg-[#3A3A3A] text-[#EAEAEA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#007AFF] placeholder:text-gray-500"
                    aria-label="Chat input"
                />
                <button
                    type="submit"
                    disabled={isLoading || !text.trim()}
                    className="w-12 h-12 flex-shrink-0 bg-[#007AFF] text-white rounded-full flex items-center justify-center transition-opacity duration-200 disabled:opacity-50 hover:bg-[#0056b3]"
                    aria-label="Send message"
                >
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
