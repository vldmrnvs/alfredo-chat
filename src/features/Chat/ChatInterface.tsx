import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../../store/store';
import { chatService } from '../../services/chatService';
import MessageRenderer from './MessageRenderer';
import TypingBubble from './TypingBubble';

// Mask Helpers
const maskCurrency = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (!v) return '';
    const floatVal = parseFloat(v) / 100;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(floatVal);
};

const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, '');
    v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v;
};

const maskCPF = (value: string) => {
    let v = value.replace(/\D/g, '');
    v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
};

function ChatInterface() {
    const { messages, inputType, quickReplies, isTyping } = useChatStore();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on input type change
    useEffect(() => {
        if (inputType !== 'hidden' && inputType !== 'options') {
            // Small timeout to ensure render visibility
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [inputType]);

    // Init Chat on mount
    useEffect(() => {
        if (!hasInitialized.current && messages.length === 0) {
            hasInitialized.current = true;
            chatService.init();
        }
    }, []);

    // Auto scroll - optimized to only trigger when messages length changes
    const messagesLengthRef = useRef(messages.length);
    useEffect(() => {
        if (messages.length !== messagesLengthRef.current) {
            messagesLengthRef.current = messages.length;
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length]);

    // Memoized handlers
    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;
        chatService.processInput(inputText);
        setInputText('');
    }, [inputText]);

    const handleQuickReply = useCallback((value: string, label: string) => {
        chatService.processInput(value, label);
    }, []);

    const isDisabled = inputType === 'hidden';

    // Handling Masks
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        if (inputType === 'currency') {
            val = maskCurrency(val);
        }
        else if (inputType === 'phone') {
            val = maskPhone(val);
        }
        else if (inputType === 'cpf') {
            val = maskCPF(val);
        }

        setInputText(val);
    }, [inputType]);

    // Dynamic Placeholder Logic
    const getPlaceholder = () => {
        if (inputType === 'hidden') return "Aguarde...";
        if (inputType === 'currency') return "R$ 0,00";
        if (inputType === 'cpf') return "000.000.000-00";
        if (inputType === 'phone') return "(00) 00000-0000";
        if (inputType === 'text') return "Insira seu nome";
        // We might want to make 'text' placeholder context-dependent in store, but "Insira seu nome" is the primary text input case here.
        return "Digite sua resposta...";
    };

    return (

        <div id="chat-container" className="flex flex-col w-full h-full bg-[#f2f2f7] fade-in overflow-hidden">
            {/* Chat Box - Scrollable Area: flex-1 fills only the space ABOVE the footer */}
            <div id="chat-box" className="flex-1 overflow-y-auto w-full scrollbar-hide">
                <div className="w-full max-w-5xl mx-auto p-[18px] md:p-6 space-y-6 pb-4">
                    {/* Header / Timestamp */}
                    <div className="flex justify-center py-4 opacity-50 text-xs font-bold uppercase tracking-widest text-[#2D4A3A]">
                        Alfredo • Consultoria Inteligente
                    </div>

                    {messages.map((msg) => (
                        <MessageRenderer key={msg.id} message={msg} />
                    ))}
                    {isTyping && <TypingBubble />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Footer: action buttons + input. Sits naturally at the bottom of the flex layout */}
            <div className="flex-shrink-0 w-full glass-input-area rounded-t-[2rem] z-20">
                {/* Action Buttons - shown above input when options are available */}
                {inputType === 'options' && quickReplies && quickReplies.length > 0 && (
                    <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
                        <div className="flex gap-2 overflow-x-auto pt-4 pb-2 scrollbar-hide">
                            {quickReplies.map((qr: any) => (
                                <button
                                    key={qr.value}
                                    onClick={() => handleQuickReply(qr.value, qr.label)}
                                    className="whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium shadow-sm border transition-all hover:shadow-md bg-white border-[#94F6AD] text-[#2D4A3A] hover:bg-[#94F6AD] hover:text-[#132116]"
                                >
                                    {qr.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="w-full max-w-5xl mx-auto relative p-4 md:p-6">
                    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type={inputType === 'currency' || inputType === 'phone' ? 'tel' : 'text'}
                                value={inputText}
                                onChange={handleInputChange}
                                disabled={isDisabled || inputType === 'options'}
                                className="w-full border-0 rounded-2xl px-6 py-4 transition font-medium shadow-inner focus:ring-2 focus:bg-white bg-[rgba(255,255,255,0.6)] text-[#132116] placeholder-gray-400 focus:ring-[#94F6AD]"
                                placeholder={getPlaceholder()}
                                autoComplete="off"
                                aria-label="Digite sua mensagem"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isDisabled || !inputText}
                            className="w-14 h-14 rounded-full transition shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 btn-mint flex-shrink-0"
                            aria-label="Enviar mensagem"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default memo(ChatInterface);
