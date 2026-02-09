import { useState } from 'react';
import { useChatStore } from '../store/store';
import { ArrowLeft, Menu, X } from 'lucide-react';

export default function Header() {
    const { view, resetChat, setActiveModal } = useChatStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (modal: 'how_it_works' | 'products' | 'contact') => {
        setActiveModal(modal);
        setIsMenuOpen(false);
    };

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
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/50 shadow-sm flex-shrink-0">
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

                {/* Desktop Nav - Only in PRE_SIM */}
                {view === 'PRE_SIM' && (
                    <nav className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => handleNavClick('how_it_works')}
                            className="px-5 py-2 rounded-full bg-[#E3FFEE]/50 hover:bg-[#94F6AD] text-[#2D4A3A] font-bold text-sm transition-all duration-300 border border-[#94F6AD]/30 hover:border-[#94F6AD] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_4px_12px_rgba(148,246,173,0.4)] backdrop-blur-sm"
                        >
                            Como funciona
                        </button>
                        <button
                            onClick={() => handleNavClick('products')}
                            className="px-5 py-2 rounded-full bg-[#E3FFEE]/50 hover:bg-[#94F6AD] text-[#2D4A3A] font-bold text-sm transition-all duration-300 border border-[#94F6AD]/30 hover:border-[#94F6AD] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_4px_12px_rgba(148,246,173,0.4)] backdrop-blur-sm"
                        >
                            Produtos
                        </button>
                        <button
                            onClick={() => handleNavClick('contact')}
                            className="px-5 py-2 rounded-full bg-[#E3FFEE]/50 hover:bg-[#94F6AD] text-[#2D4A3A] font-bold text-sm transition-all duration-300 border border-[#94F6AD]/30 hover:border-[#94F6AD] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] hover:shadow-[0_4px_12px_rgba(148,246,173,0.4)] backdrop-blur-sm"
                        >
                            Contato
                        </button>
                    </nav>
                )}

                {/* Mobile Menu Button - Only in PRE_SIM */}
                {view === 'PRE_SIM' && (
                    <button
                        className="md:hidden text-[#132116] p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                )}
            </div>

            {/* Mobile Nav Overlay */}
            {view === 'PRE_SIM' && isMenuOpen && (
                <div className="md:hidden absolute top-[72px] left-0 w-full glass-header border-t border-white/40 shadow-xl flex flex-col p-6 gap-4 animate-in slide-in-from-top-2">
                    <button
                        onClick={() => handleNavClick('how_it_works')}
                        className="text-left text-lg font-medium text-[#2D4A3A] hover:text-[#94F6AD] transition-colors py-2"
                    >
                        Como funciona
                    </button>
                    <button
                        onClick={() => handleNavClick('products')}
                        className="text-left text-lg font-medium text-[#2D4A3A] hover:text-[#94F6AD] transition-colors py-2"
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => handleNavClick('contact')}
                        className="text-left text-lg font-medium text-[#2D4A3A] hover:text-[#94F6AD] transition-colors py-2"
                    >
                        Contato
                    </button>
                </div>
            )}
        </header>
    );
}
