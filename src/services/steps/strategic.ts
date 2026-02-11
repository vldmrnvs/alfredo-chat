import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import type { Step } from './confirmation';

/**
 * Step 3: Acceleration Strategy
 */
export const accelerationStrategyStep: Step = {
    id: 3,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "Para aumentar suas chances de contemplação, você prefere:",
            sender: 'bot'
        });
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "💰 Dar Entrada Maior", value: "entrada" },
                { label: "📅 Pagar Parcelas Normais", value: "parcela" }
            ]
        } as any);
    },
    process: async (v) => {
        useChatStore.getState().updateUserData({ aceleracao_strategy: v as any });
        return { action: 'next' };
    }
};

/**
 * Step 4: Installment Preference
 */
export const installmentPreferenceStep: Step = {
    id: 4,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "Enquanto aguarda a contemplação, como prefere pagar as parcelas?",
            sender: 'bot'
        });
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "📉 Menor Possível", value: "menor" },
                { label: "⚖️ Valor Normal", value: "normal" },
                { label: "📈 Maior (Acelera Contemplação)", value: "maior" }
            ]
        } as any);
    },
    process: async (v) => {
        useChatStore.getState().updateUserData({ parcela_preference: v as any });
        return { action: 'next' };
    }
};

/**
 * Step 5: Reserve Fund Preference
 */
export const reserveFundStep: Step = {
    id: 5,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "Nos primeiros 2 meses há o fundo de reserva. Você prefere:",
            sender: 'bot'
        });
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "💵 Entrada Maior + Parcelas Menores", value: "entrada_maior" },
                { label: "💳 Entrada Menor + Parcelas Normais", value: "entrada_menor" }
            ]
        } as any);
    },
    process: async (v) => {
        useChatStore.getState().updateUserData({ fundo_reserva_preference: v as any });
        return { action: 'next' };
    }
};
