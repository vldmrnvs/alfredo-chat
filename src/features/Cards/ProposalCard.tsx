import React from 'react';
import { useChatStore } from '../../store/store';
import { RotateCw, Check } from 'lucide-react';

export default function ProposalCard() {
    const { userData, setModalOpen } = useChatStore();
    const route = userData.finalRoute;

    if (!route) return null;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 mt-2 message-enter shadow-lg text-[#132116]">
            <div className="border-b border-gray-100 pb-3 mb-3 flex justify-between items-center">
                <span className="font-bold text-lg">Resumo da Proposta</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-[#E3FFEE] text-[#2D4A3A]">
                    Grupo #{Math.floor(Math.random() * 5000) + 1000}
                </span>
            </div>
            <div className="space-y-2 text-sm opacity-80">
                <div className="flex justify-between">
                    <span>Crédito Líquido:</span>
                    <span className="font-bold text-black">{formatCurrency(route.credit)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Parcela Inicial:</span>
                    <span className="font-bold text-black">{formatCurrency(route.monthly)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Prazo:</span>
                    <span className="font-bold text-black">{route.term} meses</span>
                </div>
                <div className="flex justify-between">
                    <span>Lance Definido:</span>
                    <span className="font-bold text-[#7EF39A]">{formatCurrency(route.lanceLivre + route.lanceEmb)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Probabilidade:</span>
                    <span className="font-bold text-blue-600">{route.groupProb}</span>
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs opacity-50 text-center">
                Taxa Adm 14% (Diluída) • Fundo Reserva 2%
            </div>

            {/* Actions inside card if needed, or rely on chat Quick Replies */}
            <button
                onClick={() => setModalOpen(true)}
                className="w-full text-center py-2 text-sm font-bold text-gray-400 hover:text-gray-800 transition mt-2 flex items-center justify-center gap-1"
            >
                <RotateCw size={12} /> Personalizar ou Escolher Outra
            </button>
        </div>
    );
}
