import { useChatStore } from '../../store/store';

import { RotateCw } from 'lucide-react';

export default function ProposalCard() {
    const { userData, setModalOpen } = useChatStore();
    const route = userData.finalRoute;

    if (!route) return null;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="w-full relative overflow-hidden rounded-3xl mt-4 message-enter shadow-2xl transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group">

            {/* Glass Background */}
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border border-white/60"></div>

            {/* Header / Brand Strip */}
            <div className="relative z-10 bg-white/50 border-b border-gray-100 py-5 px-[18px] md:p-5 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E3FFEE] flex items-center justify-center border border-[#94F6AD]">
                        <span className="text-base">🚀</span>
                    </div>
                    <div>
                        <h3 className="text-[#132116] font-display font-bold text-lg leading-tight">Proposta Oficial</h3>
                        <p className="text-[#2D4A3A] text-[10px] font-bold uppercase tracking-widest opacity-60">Grupo #{Math.floor(Math.random() * 5000) + 1000}</p>
                    </div>
                </div>
                {route.groupProb === 'Alta' && (
                    <span className="badge-attribute">
                        ⚡ Alta Chance
                    </span>
                )}
            </div>

            {/* Content Body */}
            <div className="relative z-10 py-5 px-[18px] md:p-5 space-y-5">

                {/* Main Hero Value */}
                <div className="text-center pb-4 border-b border-gray-100/50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Crédito Disponível</p>
                    <p className="font-display font-bold text-4xl text-[#132116] tracking-tight">
                        {formatCurrency(route.credit)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Valor total da carta: {formatCurrency(userData.value)}
                    </p>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Parcela Mensal</p>
                        <p className="font-display font-bold text-xl text-[#132116]">{formatCurrency(route.monthly)}</p>
                    </div>
                    <div className="bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Prazo</p>
                        <p className="font-display font-bold text-xl text-[#132116]">{route.term}x</p>
                    </div>
                    <div className="bg-[#E3FFEE] p-3 rounded-xl border border-[#94F6AD]/30 col-span-2 relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-bold text-[#2D4A3A] uppercase mb-1">Seu Lance Otimizado</p>
                                <p className="font-display font-bold text-xl text-[#132116]">
                                    {formatCurrency(route.lanceLivre + route.lanceEmb)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-[#2D4A3A] opacity-60">
                                    {(route.lanceLivre > 0) ? 'Com recurso próprio' : 'Sem desembolso'}
                                </p>
                            </div>
                        </div>
                        {/* Decimal decoration */}
                        <div className="absolute -right-4 -bottom-8 opacity-30 text-9xl font-display font-bold pointer-events-none" style={{ color: '#2D6B4A' }}>
                            %
                        </div>
                    </div>
                </div>

                {/* Partner Box */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/embracon-logo.png"
                            alt="Consórcio Embracon"
                            className="h-7 object-contain"
                        />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-[#2D4A3A] opacity-50">
                        ✅ Parceiro Verificado
                    </span>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
                    <span>Taxa Adm 14% (Diluída)</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>Fundo Reserva 2%</span>
                </div>

                {/* Internal Action (if not using quick replies) */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-[#132116] hover:border-gray-300 transition shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                    <RotateCw size={14} /> Personalizar Estratégia
                </button>
            </div>
        </div>
    );
}
