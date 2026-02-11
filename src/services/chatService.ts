import { useChatStore } from '../store/store';
import {
    confirmationStep,
    usageStep,
    urgencyStep,
    accelerationStrategyStep,
    installmentPreferenceStep,
    reserveFundStep,
    lanceTypeStep,
    lanceValueStep,
    strategiesStep,
    nameStep,
    whatsappStep,
    cpfStep,
    checkoutStep,
    pixPaymentStep,
    docsUploadStep,
    checkinFormStep,
    successStep,
    type Step
} from './steps';

/**
 * Chat Service - Orchestrates the conversational flow for Alfredo Consórcios
 * 
 * Refactored from 782 lines to modular architecture:
 * - Each step is in its own module (< 100 lines)
 * - Validators are separated
 * - AI analysis is isolated for easy replacement
 * - Better testability and maintainability
 */

// ============================================================================
// FLOW STEPS ARRAY
// ============================================================================

const steps: Step[] = [
    confirmationStep,        // Step 0
    usageStep,              // Step 1
    urgencyStep,            // Step 2
    accelerationStrategyStep, // Step 3
    installmentPreferenceStep, // Step 4
    reserveFundStep,        // Step 5
    lanceTypeStep,          // Step 6
    lanceValueStep,         // Step 7
    strategiesStep,         // Step 8
    nameStep,               // Step 9
    whatsappStep,           // Step 10
    cpfStep,                // Step 11
    checkoutStep,           // Step 12
    pixPaymentStep,         // Step 13
    docsUploadStep,         // Step 14
    checkinFormStep,        // Step 15
    successStep             // Step 16
];

// ============================================================================
// CHAT SERVICE
// ============================================================================

export const chatService = {
    /**
     * Initialize chat flow with welcome message
     */
    init: async () => {
        const { addMessage, userData } = useChatStore.getState();

        // Format value for display
        const valFormatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(userData.value);

        // Contextual message for budget-based simulations
        if (userData.isBudgetBased) {
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: `Entendi. Com orçamento de <b>${valFormatted}</b>, vou focar em <b>Longevidade</b> para maximizar seu crédito.`,
                sender: 'bot'
            });
        } else {
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: `Recebi sua solicitação de <b>${valFormatted}</b> para <b>${userData.goal}</b>.`,
                sender: 'bot'
            });
        }

        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "O valor está correto? Vou fazer algumas perguntas rápidas para calibrar sua estratégia.",
            sender: 'bot'
        });

        // Show confirmation options
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "✅ Sim, Bora lá", value: "sim" },
                { label: "✏️ Corrigir Valor", value: "corrigir" }
            ]
        } as any);
    },

    /**
     * Simulate bot typing indicator
     */
    botTyping: async (ms = 1200): Promise<void> => {
        const { setTyping } = useChatStore.getState();
        setTyping(true);
        return new Promise(resolve => setTimeout(() => {
            setTyping(false);
            resolve();
        }, ms));
    },

    /**
     * Process user input and advance through steps
     */
    processInput: async (value: string, label?: string) => {
        const state = useChatStore.getState();
        const { stepIndex, addMessage, setStepIndex } = state;

        // 1. Add User Message
        addMessage({ type: 'text', content: label || value, sender: 'user' });

        // 2. Clear Inputs
        useChatStore.setState({ inputType: 'hidden', quickReplies: [] } as any);

        // 3. Process Current Step
        const currentStep = steps[stepIndex];
        if (currentStep) {
            const result = await currentStep.process(value);

            if (result.action === 'next') {
                const nextIdx = stepIndex + 1;
                setStepIndex(nextIdx);
                if (steps[nextIdx]) {
                    await steps[nextIdx].ask();
                }
            } else if (result.action === 'jump') {
                const nextIdx = result.target!;
                setStepIndex(nextIdx);
                if (steps[nextIdx]) await steps[nextIdx].ask();
            }
            // 'wait' does nothing, stays on same step
        }
    }
};

// ============================================================================
// EXTERNAL HELPERS
// ============================================================================

/**
 * Advance flow from external components (Modal, Cards)
 */
export const advanceFlow = async (value?: string) => {
    const { stepIndex } = useChatStore.getState();
    const current = steps[stepIndex];
    if (current) {
        await chatService.processInput(value || 'internal_action', value);
    }
};
