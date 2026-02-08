import React from 'react';

export default function TypingBubble() {
    return (
        <div className="flex w-full message-enter justify-start my-2">
            <div className="bubble-alfredo rounded-2xl rounded-tl-none p-4 flex items-center gap-1 w-16 h-10">
                <div className="w-2 h-2 bg-[#2D4A3A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#2D4A3A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#2D4A3A] rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}
