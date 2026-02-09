import { useChatStore } from '../store/store';
import { triggerCelebration } from '../utils/confetti';

// Types for the flow steps
type StepAction = 'next' | 'wait' | 'jump';

interface Step {
    id: number;
    ask: () => Promise<void>;
    process: (value: string) => Promise<{ action: StepAction; target?: number }>;
}

// Mock AI functions
const mockAiAnalysis = async (profile: any) => {
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve(`⚡ <b>Análise:</b> Para ${profile.goal} com urgência ${profile.urgency}, o mercado está favorável para lances intermediários.`);
        }, 1500);
    });
};

// Helper to interact with Store from Service (since hooks are for components)
// We will pass the store specific functions or use the store subscription outside?
// Better: The Component calls the service, and the service uses the store.
// But `useChatStore` is a hook. We need `useChatStore.getState()` for non-reactive access.

export const chatService = {

    init: async () => {
        const { addMessage, userData } = useChatStore.getState();

        // Initial bot message based on PreSim data
        const valFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(userData.value);

        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: `Recebi sua solicitação de <b>${valFormatted}</b> para <b>${userData.goal}</b>.`,
            sender: 'bot'
        });

        await chatService.botTyping();
        addMessage({
            type: 'text',
            content: "O valor está correto? Vou fazer algumas perguntas rápidas para calibrar sua estratégia.",
            sender: 'bot'
        });

        // Show options
        useChatStore.setState({
            inputType: 'options',
            quickReplies: [
                { label: "✅ Sim, Bora lá", value: "sim" },
                { label: "✏️ Corrigir Valor", value: "corrigir" }
            ]
        } as any); // Type hacking for quickReplies which I missed in store definition
    },

    botTyping: async (ms = 1200) => {
        const { setTyping } = useChatStore.getState();
        setTyping(true);
        return new Promise(resolve => setTimeout(() => {
            setTyping(false);
            resolve(true);
        }, ms));
    },

    processInput: async (value: string, label?: string) => {
        const state = useChatStore.getState();
        const { stepIndex, addMessage, setStepIndex } = state;

        // 1. Add User Message
        addMessage({ type: 'text', content: label || value, sender: 'user' });

        // 2. Clear Inputs
        useChatStore.setState({ inputType: 'hidden', quickReplies: [] } as any);

        // 3. Process Steps
        const currentStep = steps[stepIndex];
        if (currentStep) {
            const result = await currentStep.process(value);

            if (result.action === 'next') {
                const nextIdx = stepIndex + 1;
                setStepIndex(nextIdx);
                if (steps[nextIdx]) {
                    await steps[nextIdx].ask();
                } else {
                    // End of defined steps
                    console.log("End of steps");
                }
            } else if (result.action === 'jump') {
                const nextIdx = result.target!;
                setStepIndex(nextIdx);
                if (steps[nextIdx]) await steps[nextIdx].ask();
            }
            // 'wait' does nothing, stays on same step (e.g. invalid input)
        }
    }
};

// --- THE FUNNEL STEPS (Value First) ---
const steps: Step[] = [
    {
        id: 0, // Confirm Value
        ask: async () => { }, // Previously handled in init
        process: async (v) => {
            const { addMessage, updateUserData } = useChatStore.getState();
            const lowerV = v.toLowerCase();

            // If user says "corrigir", we start the correction flow
            if (lowerV.includes('corrigir') || lowerV.includes('nao') || lowerV.includes('não')) {
                await chatService.botTyping();
                addMessage({ type: 'text', content: "Sem problemas. Qual o valor correto?", sender: 'bot' });
                useChatStore.setState({ inputType: 'currency' } as any);
                return { action: 'wait' };
            }

            // If user says "sim", we proceed
            if (lowerV.includes('sim') || lowerV.includes('bora') || lowerV.includes('ok')) {
                return { action: 'next' };
            }

            // Otherwise, we assume it's a value input (correction)
            // Strict parsing: remove everything except digits and comma
            const cleanStr = v.replace(/[^\d,]/g, '').replace(',', '.');
            const numVal = parseFloat(cleanStr);

            if (!isNaN(numVal) && numVal > 0) {
                updateUserData({ value: numVal });
                // We could verify here: "Entendido, R$ X. Confirmado?" 
                // But for now, let's assume valid input moves to next step to be fluid.
                return { action: 'next' };
            }

            // Invalid input
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Não entendi o valor. Pode digitar novamente? (Ex: 300.000)", sender: 'bot' });
            return { action: 'wait' };
        }
    },
    {
        id: 1, // Usage / Goal
        ask: async () => {
            const { userData, addMessage } = useChatStore.getState();
            await chatService.botTyping();
            if (userData.goal === 'imovel') {
                addMessage({ type: 'text', content: "Qual o objetivo principal?", sender: 'bot' });
                useChatStore.setState({
                    inputType: 'options', quickReplies: [
                        { label: "🏠 Morar", value: "morar" },
                        { label: "💸 Investir", value: "investir" },
                        { label: "🏗️ Construir", value: "construir" }
                    ]
                } as any);
            } else {
                addMessage({ type: 'text', content: "Qual será o uso?", sender: 'bot' });
                useChatStore.setState({
                    inputType: 'options', quickReplies: [
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
    },
    {
        id: 2, // Urgency
        ask: async () => {
            const { addMessage } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Sobre pressa, qual sua realidade?", sender: 'bot' });
            useChatStore.setState({
                inputType: 'options', quickReplies: [
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
    },
    {
        id: 3, // Lance (Moved UP)
        ask: async () => {
            const { addMessage, userData } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Sobre <b>Aceleração</b>. Você tem algum valor ou bem para dar de lance?", sender: 'bot' });

            const opts = [
                { label: "❌ Não tenho lance", value: "nada" },
                { label: "💰 Dinheiro (Recurso Próprio)", value: "dinheiro" }
            ];
            if (userData.goal === 'imovel') opts.push({ label: "🏦 FGTS", value: "fgts" });
            opts.push({ label: "🚗 Veículo", value: "carro" });
            // ... logic for other assets

            useChatStore.setState({ inputType: 'options', quickReplies: opts } as any);
        },
        process: async (v) => {
            if (v === 'nada') {
                useChatStore.getState().updateUserData({ has_lance: false, lance_type: 'nada' });
                return { action: 'jump', target: 5 }; // Skip lance value
            }
            useChatStore.getState().updateUserData({ has_lance: true, lance_type: v as any });
            return { action: 'next' };
        }
    },
    {
        id: 4, // Lance Value
        ask: async () => {
            const { addMessage, userData } = useChatStore.getState();
            await chatService.botTyping();
            let msg = "Qual o valor disponível?";
            if (userData.lance_type === 'fgts') msg = "Qual o saldo aproximado do seu FGTS?";
            if (userData.lance_type === 'carro') msg = "Qual o valor de mercado do veículo?";

            addMessage({ type: 'text', content: msg, sender: 'bot' });
            useChatStore.setState({ inputType: 'currency' } as any);
        },
        process: async (v) => {
            // parse currency
            const val = parseFloat(v.replace(/\D/g, '')) / 100;
            useChatStore.getState().updateUserData({ lance_value: val });
            return { action: 'next' };
        }
    },
    {
        id: 5, // SHOW ROUTES (The "Value" Moment)
        ask: async () => {
            const { addMessage, userData, setModalOpen } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({ type: 'text', content: `✨ <i>Analisando grupos ativos para o perfil <b>${userData.goal}</b>...</i>`, sender: 'bot' });

            await chatService.botTyping(1500);
            const aiMsg = await mockAiAnalysis(userData);
            addMessage({ type: 'text', content: aiMsg, sender: 'bot' }); // isAi message style?

            await chatService.botTyping();
            addMessage({ type: 'text', content: "Encontrei estas 3 rotas vencedoras:", sender: 'bot' });

            // Show Strategy Cards in Chat
            addMessage({ type: 'card', content: 'strategies', sender: 'bot' });

            // Trigger Modal Open via Store (User can also open by clicking cards)
            setTimeout(() => setModalOpen(true), 800);

            // No input needed, waiting for modal selection
            useChatStore.setState({ inputType: 'hidden' } as any);
        },
        process: async (v) => {
            // Strict check: Only advance if a route was actually saved
            const { userData, setModalOpen, addMessage } = useChatStore.getState();
            if (userData.finalRoute) {
                return { action: 'next' };
            }

            // If somehow triggered without route, re-open modal or ask
            if (v !== 'internal_action') {
                await chatService.botTyping();
                addMessage({ type: 'text', content: "Por favor, escolha uma das estratégias acima para continuarmos.", sender: 'bot' });
                setModalOpen(true);
            }

            return { action: 'wait' };
        }
    },
    {
        id: 6, // After Strategy Selection -> Capture Contact (Name)
        ask: async () => {
            const { addMessage } = useChatStore.getState();

            // 1. Show Proposal Summary immediately after selection
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Aqui está o resumo da estratégia escolhida:", sender: 'bot' });
            addMessage({ type: 'card', content: 'proposal', sender: 'bot' });

            // 2. Ask Name
            await chatService.botTyping(1500);
            addMessage({ type: 'text', content: "Ótima escolha! Para formalizar a proposta, qual seu nome completo?", sender: 'bot' });
            useChatStore.setState({ inputType: 'text' } as any);
        },
        process: async (v) => {
            useChatStore.getState().updateUserData({ name: v });
            return { action: 'next' };
        }
    },
    {
        id: 7, // WhatsApp
        ask: async () => {
            const { addMessage, userData } = useChatStore.getState();
            await chatService.botTyping();
            const firstName = userData.name.split(' ')[0];
            addMessage({ type: 'text', content: `Prazer, ${firstName}! Qual seu WhatsApp para eu enviar o PDF da proposta?`, sender: 'bot' });
            useChatStore.setState({ inputType: 'phone' } as any);
        },
        process: async (v) => {
            useChatStore.getState().updateUserData({ whatsapp: v });
            return { action: 'next' };
        }
    },
    {
        id: 8, // CPF (Restored)
        ask: async () => {
            const { addMessage } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({ type: 'text', content: "CPF? (Só para checar sua elegibilidade em ofertas relâmpago).", sender: 'bot' });
            useChatStore.setState({ inputType: 'cpf' } as any);
        },
        process: async (v) => {
            const clean = v.replace(/\D/g, '');
            const { addMessage, updateUserData, userData } = useChatStore.getState();

            if (clean.length !== 11) {
                await chatService.botTyping();
                addMessage({ type: 'text', content: "⚠️ O CPF precisa ter 11 dígitos.", sender: 'bot' });
                return { action: 'wait' };
            }

            // Simple CPF Validation
            const isValidCPF = (cpf: string) => {
                cpf = cpf.replace(/[^\d]+/g, '');
                if (cpf == '') return false;
                if (cpf.length != 11 || /^(\d)\1+$/.test(cpf)) return false;
                let add = 0;
                for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
                let rev = 11 - (add % 11);
                if (rev == 10 || rev == 11) rev = 0;
                if (rev != parseInt(cpf.charAt(9))) return false;
                add = 0;
                for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
                rev = 11 - (add % 11);
                if (rev == 10 || rev == 11) rev = 0;
                if (rev != parseInt(cpf.charAt(10))) return false;
                return true;
            };

            const tags = userData.tags || [];
            if (!isValidCPF(clean)) {
                await chatService.botTyping();
                addMessage({ type: 'text', content: "⚠️ CPF não verificado, mas vamos seguir com a simulação. 🚀", sender: 'bot' });
                tags.push('CPF_INVALIDO');
            }

            updateUserData({ cpf: v, tags });
            return { action: 'next' };
        }
    },

    {
        id: 9, // Checkout / Proposal Summary
        ask: async () => {
            const { addMessage } = useChatStore.getState();
            // Proposal Card was already shown in Step 6.
            // Just ask for confirmation/checkout options.

            await chatService.botTyping();

            // Ask for confirmation
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Confirma os valores para gerarmos o contrato?", sender: 'bot' });

            useChatStore.setState({
                inputType: 'options', quickReplies: [
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

                // Construct WhatsApp Link
                const message = `Olá! Me chamo ${userData.name}. Estava na simulação (R$ ${userData.value}) e gostaria de ajuda humana.`;
                const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;

                addMessage({
                    type: 'text',
                    content: `<a href="${whatsappUrl}" target="_blank" class="underline font-bold text-green-600">👉 Falar no WhatsApp</a>`,
                    sender: 'bot'
                });

                return { action: 'wait' }; // Stay here so they can choose "pay" later if they want
            }

            return { action: 'wait' };
        }
    },
    {
        id: 10, // Pix Payment
        ask: async () => {
            const { addMessage } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Gerando Pix para adesão...", sender: 'bot' });
            addMessage({ type: 'card', content: 'pix', sender: 'bot' });
            // Strict: Wait for explicit "Já paguei" click in card
            useChatStore.setState({ inputType: 'hidden' } as any);
        },
        process: async (v) => {
            // Only advances when advanceFlow() is called from the card button (v === 'paguei')
            if (v === 'paguei') {
                triggerCelebration();
                return { action: 'next' };
            }
            return { action: 'wait' };
        }
    },
    {
        id: 11, // Docs
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
    },
    {
        id: 12, // Checkin Form
        ask: async () => {
            const { addMessage } = useChatStore.getState();
            await chatService.botTyping();
            addMessage({ type: 'text', content: "Recebido! Agora, por favor, só confirme seus dados pessoais abaixo para o contrato.", sender: 'bot' });
            addMessage({ type: 'card', content: 'checkin-form', sender: 'bot' });
        },
        process: async (v) => {
            if (v === 'form_completed') return { action: 'next' };
            return { action: 'wait' };
        }
    },
    {
        id: 13, // Success
        ask: async () => {
            const { addMessage } = useChatStore.getState();
            addMessage({ type: 'card', content: 'success', sender: 'bot' });
        },
        process: async () => { return { action: 'wait' }; }
    }
];

// Helper to advance from external components (Modal, Cards)
export const advanceFlow = async (value?: string) => {
    const { stepIndex } = useChatStore.getState();
    const current = steps[stepIndex];
    if (current) {
        // Mocking a process call
        await chatService.processInput(value || 'internal_action', value);
    }
};
