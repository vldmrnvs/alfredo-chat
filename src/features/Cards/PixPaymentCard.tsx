import { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { advanceFlow } from '../../services/chatService';
import { useChatStore } from '../../store/store';

export default function PixPaymentCard() {
    const { userData } = useChatStore();
    const [hasPaid, setHasPaid] = useState(false);
    const [copied, setCopied] = useState(false);

    const pixCode = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Alfredo AI6008Sao Paulo62070503***6304E2CA";
    const amount = userData.finalRoute ? userData.finalRoute.monthly : 0;

    const handleCopy = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePaid = () => {
        if (hasPaid) return;
        setHasPaid(true);
        // Trigger flow advance
        advanceFlow('paguei');
    };

    return (
        <div className="w-full text-white rounded-2xl p-6 mt-3 message-enter text-center shadow-xl relative overflow-hidden bg-[#132116]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#94F6AD] to-indigo-500"></div>

            <QrCode className="text-4xl mb-3 text-[#94F6AD] mx-auto w-10 h-10" />

            <p className="font-bold text-xl mb-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
            </p>
            <p className="text-xs text-gray-400 mb-4">Pagamento instantâneo</p>

            <div className="bg-white p-2 rounded-lg mb-4 inline-block">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pixCode}`} className="w-32 h-32" alt="QR Code" />
            </div>

            <button
                onClick={handleCopy}
                className="w-full font-bold py-3 rounded-full transition mb-3 flex items-center justify-center gap-2 bg-[#94F6AD] text-[#132116]"
            >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Código Copiado!' : 'Copiar Pix Copia e Cola'}
            </button>

            <button
                onClick={handlePaid}
                disabled={hasPaid}
                className={`w-full bg-transparent border border-gray-500 text-gray-300 hover:text-white hover:border-white font-bold py-3 rounded-full transition ${hasPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {hasPaid ? 'Processando...' : 'Já paguei'}
            </button>
        </div>
    );
}
