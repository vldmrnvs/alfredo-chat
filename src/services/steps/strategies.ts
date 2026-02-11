import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import { mockAiAnalysis } from '../ai/analysis';
import type { Step } from './confirmation';

/**
 * Step 8: Show Strategies
 * Displays AI analysis and strategy cards
 */
export const strategiesStep: Step = {
    id: 8,
    ask: async () => {
        const { addMessage, userData, setModalOpen } = useChatStore.getState();
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: `✨ <i>Analisando grupos ativos para o perfil <b>${userData.goal}</b>...</i>`,
            sender: 'bot'
        });

        await chatService.botTyping(1500);
        const aiMsg = await mockAiAnalysis(userData);
        addMessage({ type: 'text', content: aiMsg, sender: 'bot' });

        await chatService.botTyping();
        addMessage({ type: 'text', content: "Encontrei estas 3 rotas vencedoras:", sender: 'bot' });

        // Show Strategy Cards
        addMessage({ type: 'card', content: 'strategies', sender: 'bot' });

        // Auto-open modal
        setTimeout(() => setModalOpen(true), 800);

        useChatStore.setState({ inputType: 'hidden' } as any);
    },
    process: async (v) => {
        const { userData, setModalOpen, addMessage } = useChatStore.getState();

        // Only advance if a route was selected
        if (userData.finalRoute) {
            return { action: 'next' };
        }

        // Re-prompt if no selection
        if (v !== 'internal_action') {
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: "Por favor, escolha uma das estratégias acima para continuarmos.",
                sender: 'bot'
            });
            setModalOpen(true);
        }

        return { action: 'wait' };
    }
};
