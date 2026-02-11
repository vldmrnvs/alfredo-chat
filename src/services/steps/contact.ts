import { useChatStore } from '../../store/store';
import { chatService } from '../chatService';
import { isValidPhone } from '../validators/phone';
import { isValidCPF } from '../validators/cpf';
import type { Step } from './confirmation';

/**
 * Step 9: Name
 */
export const nameStep: Step = {
    id: 9,
    ask: async () => {
        const { addMessage } = useChatStore.getState();

        // Show proposal summary
        await chatService.botTyping();
        addMessage({ type: 'text', content: "Aqui está o resumo da estratégia escolhida:", sender: 'bot' });
        addMessage({ type: 'card', content: 'proposal', sender: 'bot' });

        // Ask for name
        await chatService.botTyping(1500);
        addMessage({
            type: 'text',
            content: "Ótima escolha! Para formalizar a proposta, qual seu nome completo?",
            sender: 'bot'
        });
        useChatStore.setState({ inputType: 'text' } as any);
    },
    process: async (v) => {
        useChatStore.getState().updateUserData({ name: v });
        return { action: 'next' };
    }
};

/**
 * Step 10: WhatsApp (with validation)
 */
export const whatsappStep: Step = {
    id: 10,
    ask: async () => {
        const { addMessage, userData } = useChatStore.getState();
        await chatService.botTyping();
        const firstName = userData.name.split(' ')[0];
        addMessage({
            type: 'text',
            content: `Prazer, ${firstName}! Qual seu WhatsApp para eu enviar o PDF da proposta?`,
            sender: 'bot'
        });
        useChatStore.setState({ inputType: 'phone' } as any);
    },
    process: async (v) => {
        const { addMessage } = useChatStore.getState();

        // Validate phone
        if (!isValidPhone(v)) {
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: "⚠️ Telefone inválido. Use o formato (XX) 9XXXX-XXXX.",
                sender: 'bot'
            });
            useChatStore.setState({ inputType: 'phone' } as any);
            return { action: 'wait' };
        }

        useChatStore.getState().updateUserData({ whatsapp: v });
        return { action: 'next' };
    }
};

/**
 * Step 11: CPF (with double-check on invalid CPF)
 */
let pendingCpf = '';

export const cpfStep: Step = {
    id: 11,
    ask: async () => {
        const { addMessage } = useChatStore.getState();
        pendingCpf = '';
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "CPF? (Só para checar sua elegibilidade em ofertas relâmpago).",
            sender: 'bot'
        });
        useChatStore.setState({ inputType: 'cpf' } as any);
    },
    process: async (v) => {
        const { addMessage, updateUserData, userData } = useChatStore.getState();

        // --- Sub-flow: Handle confirmation response for invalid CPF ---
        if (pendingCpf) {
            if (v === 'continue_cpf') {
                // User chose to continue with invalid CPF
                const tags = [...(userData.tags || []), 'CPF_INVALIDO'];
                updateUserData({ cpf: pendingCpf, tags });
                pendingCpf = '';
                return { action: 'next' };
            } else {
                // User wants to correct
                pendingCpf = '';
                await chatService.botTyping();
                addMessage({
                    type: 'text',
                    content: "Sem problema! Digite o CPF novamente.",
                    sender: 'bot'
                });
                useChatStore.setState({ inputType: 'cpf' } as any);
                return { action: 'wait' };
            }
        }

        // --- Main flow: Validate raw CPF input ---
        const clean = v.replace(/\D/g, '');

        if (clean.length !== 11) {
            await chatService.botTyping();
            addMessage({
                type: 'text',
                content: "⚠️ O CPF precisa ter 11 dígitos.",
                sender: 'bot'
            });
            useChatStore.setState({ inputType: 'cpf' } as any);
            return { action: 'wait' };
        }

        const formatted = clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        // Valid CPF → save and proceed directly
        if (isValidCPF(clean)) {
            updateUserData({ cpf: formatted, tags: userData.tags || [] });
            return { action: 'next' };
        }

        // Invalid CPF → ask user to confirm or correct
        pendingCpf = formatted;
        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: `⚠️ O CPF <b>${formatted}</b> não foi verificado. Deseja corrigir ou seguir assim?`,
            sender: 'bot'
        });
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { value: 'correct_cpf', label: '✏️ Corrigir CPF' },
                { value: 'continue_cpf', label: '🚀 Seguir assim' }
            ]
        } as any);
        return { action: 'wait' };
    }
};
