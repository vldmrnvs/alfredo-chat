import { useChatStore } from '../store/store';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
    const { view, resetChat } = useChatStore();

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass-header px-6 py-4">
            <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {view !== 'PRE_SIM' && (
                        <button
                            id="back-button"
                            onClick={resetChat}
                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-[#132116] transition-colors mr-2 cursor-pointer"
                            aria-label="Voltar ao início"
                        >
                            <ArrowLeft size={16} />
                        </button>
                    )}

                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 shadow-sm flex-shrink-0">
                        <img
                            src="/alfredo-avatar.png"
                            alt="Alfredo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-lg leading-tight text-[#132116]">
                            Alfredo Consórcios
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">
                            AI Powered Advisor
                        </p>
                    </div>
                </div>

                {/* Optional Nav or Actions */}
                <div className="flex gap-4">
                    {/* Placeholder for future nav items */}
                </div>
            </div>
        </header>
    );
}
