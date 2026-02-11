import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import type { Step } from './confirmation';

/**
 * Step 1: Usage/Goal
 * Asks about the primary usage of the asset
 */
export const usageStep: Step = {
    id: 1,
    ask: async () => {
        const { userData, addMessage } = useChatStore.getState();
        await chatService.botTyping();

        if (userData.goal === 'imovel') {
            addMessage({ type: 'text', content: "Qual o objetivo principal?", sender: 'bot' });
            useChatStore.setState({
                inputType: 'options',
                quickReplies: [
                    { label: "🏠 Morar", value: "morar" },
                    { label: "💸 Investir", value: "investir" },
                    { label: "🏗️ Construir", value: "construir" }
                ]
            } as any);
        } else {
            addMessage({ type: 'text', content: "Qual será o uso?", sender: 'bot' });
            useChatStore.setState({
                inputType: 'options',
                quickReplies: [
                    { label: "🚗 Pessoal", value: "pessoal" },
                    { label: "💼 Trabalho", value: "trabalho" },
                    { label: "🔄 Troca", value: "troca" }
                ]
            } as any);
        }
    },
    process: async (v) => {
        useChatStore.getState().updateUserData({ usage: v as any });
        return { action: 'next' };
    }
};

/**
 * Step 2: Urgency
 * Asks about the timeline/urgency
 */
export const urgencyStep: Step = {
    id: 2,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({ type: 'text', content: "Sobre pressa, qual sua realidade?", sender: 'bot' });
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "⚡ Para Ontem", value: "imediata" },
                { label: "🔥 3-6 Meses", value: "media" },
                { label: "📅 Planejado", value: "longa" },
                { label: "💰 Investimento", value: "investidor" }
            ]
        } as any);
    },
    process: async (v) => {
        useChatStore.getState().updateUserData({ urgency: v as any });
        return { action: 'next' };
    }
};
