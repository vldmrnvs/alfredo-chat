

export default function TypingBubble() {
    return (
        <div className="flex w-full message-enter items-start gap-2 justify-start my-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 shadow-sm flex-shrink-0 mt-1">
                <img alt="Alfredo" className="w-full h-full object-cover" src="/alfredo-avatar.png" />
            </div>
            <div className="bubble-alfredo rounded-2xl rounded-tl-none p-4 flex items-center gap-1 w-16 h-10">
                <div className="w-2 h-2 bg-[#2D4A3A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-[#2D4A3A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-[#2D4A3A] rounded-full animate-bounce"></div>
            </div>
        </div>
    );
}
