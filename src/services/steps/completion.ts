import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import type { Step } from './confirmation';

/**
 * Step 14: Docs Upload
 */
export const docsUploadStep: Step = {
    id: 14,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({ type: 'text', content: "Pagamento identificado! 🚀 Parabéns.", sender: 'bot' });
        await chatService.botTyping();
        addMessage({ type: 'text', content: "Para oficializar, preciso de uma foto do RG/CNH.", sender: 'bot' });
        addMessage({ type: 'card', content: 'docs', sender: 'bot' });
    },
    process: async (v) => {
        if (v === 'docs_uploaded') return { action: 'next' };
        return { action: 'wait' };
    }
};

/**
 * Step 15: Checkin Form
 */
export const checkinFormStep: Step = {
    id: 15,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "Recebido! Agora, por favor, só confirme seus dados pessoais abaixo para o contrato.",
            sender: 'bot'
        });
        addMessage({ type: 'card', content: 'checkin-form', sender: 'bot' });
    },
    process: async (v) => {
        if (v === 'form_completed') return { action: 'next' };
        return { action: 'wait' };
    }
};

/**
 * Step 16: Success
 */
export const successStep: Step = {
    id: 16,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        addMessage({ type: 'card', content: 'success', sender: 'bot' });
    },
    process: async () => {
        return { action: 'wait' };
    }
};
