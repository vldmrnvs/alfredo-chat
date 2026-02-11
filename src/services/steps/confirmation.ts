import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import { parseMaskedCurrency } from '../validators/currency';

export interface Step {
    id: number;
    ask: () => Promise<void>;
    process: (value: string) => Promise<{ action: 'next' | 'wait' | 'jump'; target?: number }>;
}

/**
 * Step 0: Confirm Value
 * Asks user to confirm the initial value or correct it
 */
export const confirmationStep: Step = {
    id: 0,
    ask: async () => { }, // Handled in chatService.init
    process: async (v) => {
        const { addMessage, updateUserData } = useChatStore.getState();
        const lowerV = v.toLowerCase();

        // User wants to correct value
        if (lowerV.includes('corrigir') || lowerV.includes('nao') || lowerV.includes('não')) {
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Sem problemas. Qual o valor correto?", sender: 'bot' });
            useChatStore.setState({ inputType: 'currency' } as any);
            return { action: 'wait' };
        }

        // User confirms value
        if (lowerV.includes('sim') || lowerV.includes('bora') || lowerV.includes('ok')) {
            return { action: 'next' };
        }

        // Assume it's a corrected value input
        const numVal = parseMaskedCurrency(v);

        if (!isNaN(numVal) && numVal > 0) {
            updateUserData({ value: numVal });
            return { action: 'next' };
        }

        // Invalid input
        await chatService.botTyping();
        addMessage({ type: 'text', content: "Não entendi o valor. Pode digitar novamente? (Ex: 300.000)", sender: 'bot' });
        return { action: 'wait' };
    }
};
