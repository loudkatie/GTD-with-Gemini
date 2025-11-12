
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
    message: Message;
}

const LoadingDots: React.FC = () => (
    <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isAi = message.from === 'ai';
    const isSystem = message.from === 'system';
    const isLoading = message.id === 'loading';

    if (isSystem) {
        return (
            <div className="text-center text-xs text-gray-500 italic py-2">
                {message.text}
            </div>
        );
    }

    const wrapperClasses = `flex items-end gap-2 ${isAi ? 'justify-start' : 'justify-end'}`;
    const bubbleClasses = `max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${isAi ? 'bg-gray-700 text-white rounded-bl-none' : 'bg-teal-600 text-white rounded-br-none'}`;

    return (
        <div className={wrapperClasses}>
            {isAi && (
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    AI
                </div>
            )}
            <div className={bubbleClasses}>
                {isLoading ? <LoadingDots /> : message.text}
                {message.component && <div className="mt-3">{message.component}</div>}
                 {message.grounding && message.grounding.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-600">
                        <h4 className="text-xs font-bold text-gray-400 mb-1">Sources:</h4>
                        <ul className="text-xs space-y-1">
                            {message.grounding.map((g, i) => (
                                <li key={i}>
                                    <a href={g.uri} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline truncate block">
                                        {g.title || 'Google Maps Link'}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
