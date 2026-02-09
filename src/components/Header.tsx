import { useChatStore } from '../store/store';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
    const { view, resetChat, setActiveModal } = useChatStore();

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass-header px-6 py-4">
            <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Back Button - Only in Chat */}
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

                    {/* Logo Logic */}
                    {view === 'PRE_SIM' ? (
                        <img
                            src="/assets/logoalfredo.svg"
                            alt="Alfredo Consórcios"
                            className="h-10 w-auto" // Adjust height as needed
                        />
                    ) : (
                        // Chat Header Style
                        <div className="flex items-center gap-3">
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
                    )}
                </div>

                {/* Nav - Only in PRE_SIM */}
                {view === 'PRE_SIM' && (
                    <nav className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveModal('how_it_works')}
                            className="text-sm font-medium text-[#2D4A3A] hover:text-[#94F6AD] transition-colors"
                        >
                            Como funciona
                        </button>
                        <button
                            onClick={() => setActiveModal('products')}
                            className="text-sm font-medium text-[#2D4A3A] hover:text-[#94F6AD] transition-colors"
                        >
                            Produtos
                        </button>
                        <button
                            onClick={() => setActiveModal('contact')}
                            className="text-sm font-medium text-[#2D4A3A] hover:text-[#94F6AD] transition-colors"
                        >
                            Contato
                        </button>
                    </nav>
                )}
            </div>
        </header>
    );
}
