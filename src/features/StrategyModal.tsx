import { useEffect, useState } from 'react';
import { X, SlidersHorizontal, Check, Info } from 'lucide-react';
import { useChatStore } from '../store/store';
import { advanceFlow } from '../services/chatService';

export default function StrategyModal() {
    const { modalOpen, setModalOpen, userData, updateUserData } = useChatStore();
    const [activeRoute, setActiveRoute] = useState<any>(null); // To store details of selected
    const [mounted, setMounted] = useState(false);

    // Mixer State
    const [lanceLivre, setLanceLivre] = useState(0);
    const [lanceEmbutidoPct, setLanceEmbutidoPct] = useState(0);

    // Mock Data for Routes - In real app, this comes from service/AI
    // We need to generate these based on user input (userData)
    const baseValue = userData.value;

    // Example Routes
    const routes = [
        { id: 'longevidade', icon: '📅', badge: '📉 Menor Parcela', title: 'Parcela Menor', desc: 'Foco no longo prazo.', term: 200, rate: 14, entry: 0 },
        { id: 'embutido', icon: '🧩', badge: '🧠 Sem Desembolso', title: 'Lance Embutido', desc: 'Use a própria carta.', term: 180, rate: 16, entry: 0 },
        { id: 'rapida', icon: '🚀', badge: '🔥 Mais Escolhido', title: 'Aceleração', desc: 'Grupo em andamento.', term: 140, rate: 16, entry: 0.25 }
    ];

    useEffect(() => {
        if (modalOpen) {
            setMounted(true);
            // Default to first route or intelligent pick
            handleRouteSelect(routes[0]);
        } else {
            setTimeout(() => setMounted(false), 400); // Wait for exit anim
        }
    }, [modalOpen]);

    const handleRouteSelect = (route: any) => {
        setActiveRoute(route);
        // Reset mixer for new route
        setLanceLivre(userData.lance_value || 0); // Start with what user said they had
        setLanceEmbutidoPct(0);
    };

    // Mixer Calculations
    const calculateMixer = () => {
        if (!activeRoute) return { monthly: 0, credit: 0, totalLance: 0, prob: 'Baixa', totalDebt: 0 };

        const embVal = baseValue * (lanceEmbutidoPct / 100);
        const totalLance = lanceLivre + embVal;
        const netCredit = baseValue - embVal;
        const totalDebt = baseValue * (1 + activeRoute.rate / 100);
        const monthly = (totalDebt - lanceLivre) / activeRoute.term;

        let prob = 'Baixa';
        const lancePct = (totalLance / baseValue) * 100;
        if (lancePct > 15) prob = 'Média';
        if (lancePct > 30) prob = 'Alta';

        return { monthly, credit: netCredit, totalLance, prob, totalDebt };
    };

    const mix = calculateMixer();

    const handleConfirm = () => {
        if (!activeRoute) return;

        // Save final strategy
        updateUserData({
            finalRoute: {
                title: activeRoute.title,
                monthly: mix.monthly,
                term: activeRoute.term,
                credit: mix.credit,
                totalCost: mix.totalDebt,
                groupProb: mix.prob,
                lanceLivre,
                lanceEmb: baseValue * (lanceEmbutidoPct / 100)
            }
        });

        setModalOpen(false);
        // Trigger next step in Chat with detailed message
        const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        const msg = `Confirmar ${activeRoute.title} (${fmt.format(mix.monthly)} por mês em ${activeRoute.term}x)`;
        setTimeout(() => advanceFlow(msg), 500);
    };

    if (!mounted) return null;

    return (
        <div className={`fixed inset-0 z-[60] flex justify-center bg-white transition-opacity ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white w-full h-full shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 ${modalOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-[#132116]">Estratégia</h2>
                        <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-50">Configuração Avançada</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-black flex items-center justify-center transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white">
                    {/* Route Selection Cards (Mini) if we want multiple choices visible, or just details of one */}
                    {/* For simplicity match original details view but maybe allow switching on top? */}

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        {routes.map(r => (
                            <button
                                key={r.id}
                                onClick={() => handleRouteSelect(r)}
                                className={`flex flex-col items-center justify-center text-center gap-1 px-1 py-3 rounded-xl border text-[11px] uppercase tracking-wide font-bold transition-all ${activeRoute?.id === r.id
                                    ? 'bg-[#132116] text-white border-[#132116] ring-1 ring-[#132116]'
                                    : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-base">{r.icon}</span>
                                <span className="leading-tight">{r.title}</span>
                            </button>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest mb-2">Sua Parcela Estimada</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-[32px] md:text-5xl font-display font-bold tracking-tight text-[#132116]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mix.monthly)}
                            </span>
                            <span className="font-medium opacity-40">/mês</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-6"></div>

                    {/* Mixer UI */}
                    <div className="mb-6">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <h3 className="font-bold flex items-center justify-center gap-2 text-[#132116] text-lg">
                                <SlidersHorizontal size={22} className="opacity-40" /> Mixer de Lance
                            </h3>
                        </div>

                        {/* Probability Card - Highlighted */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Probabilidade de Contemplação</span>
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-[200px]">
                                        <div
                                            className={`h-full transition-all duration-500 ${mix.prob === 'Alta' ? 'bg-emerald-500' : mix.prob === 'Média' ? 'bg-yellow-400' : 'bg-red-500'}`}
                                            style={{ width: mix.prob === 'Alta' ? '100%' : mix.prob === 'Média' ? '60%' : '30%' }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-[#132116] min-w-[50px]">{mix.prob}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-3">
                                <label className="font-bold opacity-70 flex items-center gap-1">
                                    💰 Lance do Bolso
                                    <div className="group relative">
                                        <Info size={14} className="text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                            Valor que você paga do próprio bolso para adiantar sua contemplação.
                                        </div>
                                    </div>
                                </label>
                                <span className={`font-bold px-2 py-0.5 rounded-md text-[#2D4A3A] text-lg transition-all duration-300 ${lanceLivre === 0 ? 'bg-[#E3FFEE] label-pulse' : 'bg-[#E3FFEE]'}`}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lanceLivre)}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={baseValue * 0.5}
                                step={1000}
                                value={lanceLivre}
                                onChange={(e) => setLanceLivre(Number(e.target.value))}
                                className={`w-full range-slider cursor-pointer ${lanceLivre === 0 ? 'slider-hint' : ''}`}
                                style={{
                                    background: `linear-gradient(to right, #94F6AD 0%, #94F6AD ${(lanceLivre / (baseValue * 0.5)) * 100}%, #e5e5e5 ${(lanceLivre / (baseValue * 0.5)) * 100}%, #e5e5e5 100%)`
                                }}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-3">
                                <label className="font-bold opacity-70 flex items-center gap-1">
                                    🧩 Lance Embutido
                                    <div className="group relative">
                                        <Info size={14} className="text-gray-400 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                            Usa parte do próprio crédito da carta para dar el lance, sem tirar dinheiro do bolso.
                                        </div>
                                    </div>
                                </label>
                                <span className={`font-bold px-2 py-0.5 rounded-md text-[#2D4A3A] text-lg transition-all duration-300 ${lanceEmbutidoPct === 0 ? 'bg-[#CEFA83] label-pulse' : 'bg-[#CEFA83]'}`}>
                                    {lanceEmbutidoPct}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="25"
                                step="5"
                                value={lanceEmbutidoPct}
                                onChange={(e) => setLanceEmbutidoPct(Number(e.target.value))}
                                className={`w-full range-slider cursor-pointer ${lanceEmbutidoPct === 0 ? 'slider-hint' : ''}`}
                                style={{
                                    background: `linear-gradient(to right, #CEFA83 0%, #CEFA83 ${(lanceEmbutidoPct / 25) * 100}%, #e5e5e5 ${(lanceEmbutidoPct / 25) * 100}%, #e5e5e5 100%)`
                                }}
                            />
                        </div>
                    </div>

                    {/* Details Grid */}
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <p className="text-[10px] font-bold opacity-40 uppercase mb-1">Crédito Líquido</p>
                            <p className="font-display font-bold text-lg text-[#132116]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mix.credit)}
                            </p>
                            <p className="text-[10px] opacity-40 mt-1">
                                Carta Cheia: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(baseValue)}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <p className="text-[10px] font-bold opacity-40 uppercase mb-1">Lance Total</p>
                            <p className="font-display font-bold text-lg text-[#2D4A3A]">
                                {((mix.totalLance / baseValue) * 100).toFixed(1)}%
                            </p>
                            <p className="text-[10px] opacity-40 mt-1">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mix.totalLance)}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <p className="text-[10px] font-bold opacity-40 uppercase mb-1">Prazo</p>
                            <p className="font-display font-bold text-lg text-[#132116]">{activeRoute?.term}x</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <p className="text-[10px] font-bold opacity-40 uppercase mb-1">Custo Total</p>
                            <p className="font-display font-bold text-lg text-[#132116]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mix.totalDebt)}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 flex items-center gap-4 rounded-t-[32px]">
                    <button
                        onClick={() => setModalOpen(false)}
                        className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 btn-mint font-display font-bold py-4 rounded-full shadow-xl hover:scale-[1.01] transition active:scale-95 flex items-center justify-center gap-3 text-base"
                    >
                        Confirmar <Check size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
