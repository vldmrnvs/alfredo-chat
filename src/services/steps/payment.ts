import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import { triggerCelebration } from '../../utils/confetti';
import type { Step } from './confirmation';

/**
 * Step 12: Checkout Confirmation
 */
export const checkoutStep: Step = {
    id: 12,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "Confirma os valores para gerarmos o contrato?",
            sender: 'bot'
        });

        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "🤖 Sistema Automático", value: "pay" },
                { label: "👤 Falar com Humano", value: "human" }
            ]
        } as any);
    },
    process: async (v) => {
        if (v === 'pay') return { action: 'next' };

        if (v === 'human') {
            const { addMessage, userData } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: "Entendi! Um de nossos especialistas vai te ajudar pessoalmente. Clique abaixo para chamar no WhatsApp:",
                sender: 'bot'
            });

            const message = `Olá! Me chamo ${userData.name}. Estava na simulação (R$ ${userData.value}) e gostaria de ajuda humana.`;
            const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;

            addMessage({
                type: 'text',
                content: `<a href="${whatsappUrl}" target="_blank" class="underline font-bold text-green-600">👉 Falar no WhatsApp</a>`,
                sender: 'bot'
            });

            return { action: 'wait' };
        }

        return { action: 'wait' };
    }
};

/**
 * Step 13: Pix Payment
 */
export const pixPaymentStep: Step = {
    id: 13,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({ type: 'text', content: "Gerando Pix para adesão...", sender: 'bot' });
        addMessage({ type: 'card', content: 'pix', sender: 'bot' });
        useChatStore.setState({ inputType: 'hidden' } as any);
    },
    process: async (v) => {
        if (v === 'paguei') {
            triggerCelebration();
            return { action: 'next' };
        }
        return { action: 'wait' };
    }
};
