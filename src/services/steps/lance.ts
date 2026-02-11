import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import { parseMaskedCurrency } from '../validators/currency';
import type { Step } from './confirmation';

/**
 * Step 6: Lance Type Selection
 */
export const lanceTypeStep: Step = {
    id: 6,
    ask: async () => {
        const { addMessage, userData } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "Sobre <b>Aceleração</b>. Você tem algum valor ou bem para dar de lance?",
            sender: 'bot'
        });

        const opts = [
            { label: "❌ Não tenho lance", value: "nada" },
            { label: "💰 Dinheiro (Recurso Próprio)", value: "dinheiro" }
        ];

        // Conditional options based on goal
        if (userData.goal === 'imovel') {
            opts.push({ label: "🏦 FGTS", value: "fgts" });
        }
        opts.push({ label: "🚗 Veículo", value: "carro" });

        // Add Imóvel option for auto/moto
        if (userData.goal !== 'imovel') {
            opts.push({ label: "🏠 Imóvel", value: "imovel" });
        }

        // Educational option
        opts.push({ label: "🤔 Como funciona?", value: "explicar" });

        useChatStore.setState({ inputType: 'options', quickReplies: opts } as any);
    },
    process: async (v) => {
        const { addMessage, userData, updateUserData } = useChatStore.getState();

        // Educational flow
        if (v === 'explicar') {
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: "<b>Lance:</b> É a chance de antecipar seu crédito ofertando um valor. Quem oferta mais, leva antes.",
                sender: 'bot'
            });
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: "Você pretende ofertar algo?",
                sender: 'bot'
            });

            // Re-show options WITHOUT "Como funciona?"
            const opts = [
                { label: "❌ Não vou ofertar", value: "nada" },
                { label: "💰 Sim, Dinheiro", value: "dinheiro" }
            ];
            if (userData.goal === 'imovel') opts.push({ label: "🏦 Sim, FGTS", value: "fgts" });
            opts.push({ label: "🚗 Sim, Veículo", value: "carro" });
            if (userData.goal !== 'imovel') opts.push({ label: "🏠 Sim, Imóvel", value: "imovel" });

            useChatStore.setState({ inputType: 'options', quickReplies: opts } as any);
            return { action: 'wait' };
        }

        // No lance - skip to strategies
        if (v === 'nada') {
            updateUserData({ has_lance: false, lance_type: 'nada' });
            return { action: 'jump', target: 8 }; // Skip lance value step
        }

        // Has lance - proceed to value input
        updateUserData({ has_lance: true, lance_type: v as any });
        return { action: 'next' };
    }
};

/**
 * Step 7: Lance Value Input
 */
export const lanceValueStep: Step = {
    id: 7,
    ask: async () => {
        const { addMessage, userData } = useChatStore.getState();
        await chatService.botTyping();

        let msg = "Qual o valor disponível?";
        if (userData.lance_type === 'dinheiro') msg = "Qual valor você tem disponível em dinheiro?";
        if (userData.lance_type === 'fgts') msg = "Qual o saldo aproximado do seu FGTS?";
        if (userData.lance_type === 'carro') msg = "Qual o valor de mercado do veículo?";
        if (userData.lance_type === 'imovel') msg = "Qual o valor de mercado do imóvel?";

        addMessage({ type: 'text', content: msg, sender: 'bot' });
        useChatStore.setState({ inputType: 'currency' } as any);
    },
    process: async (v) => {
        const val = parseMaskedCurrency(v);
        useChatStore.getState().updateUserData({ lance_value: val });
        return { action: 'next' };
    }
};
