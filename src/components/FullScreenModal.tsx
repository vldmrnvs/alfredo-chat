import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface FullScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function FullScreenModal({ isOpen, onClose, title, children }: FullScreenModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 md:p-6 fade-in">
            <div className="w-full h-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden animate-slideUp border border-white/50">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
                    <h2 className="text-2xl font-display font-bold text-[#132116]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-[#132116]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
}
