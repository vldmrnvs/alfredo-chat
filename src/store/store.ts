import { create } from 'zustand';

export type View = 'PRE_SIM' | 'CHAT' | 'MODAL' | 'CHECKOUT' | 'DOCS' | 'SUCCESS';
export type LanceType = 'nada' | 'dinheiro' | 'fgts' | 'carro' | 'imovel';
export type Urgency = 'imediata' | 'media' | 'longa' | 'investidor';
export type Usage = 'morar' | 'investir' | 'construir' | 'pessoal' | 'trabalho' | 'troca';

// Strategic Question Types
export type AceleracaoStrategy = 'entrada' | 'parcela';
export type ParcelaPreference = 'menor' | 'normal' | 'maior';
export type FundoReservaPreference = 'entrada_maior' | 'entrada_menor';

export interface ChatMessage {
  id: string;
  type: 'text' | 'card' | 'divider' | 'system' | 'image';
  content: string; // or structured content
  sender: 'user' | 'bot';
  metadata?: any;
}

export interface UserData {
  goal: string;
  usage: Usage | '';
  urgency: Urgency | '';
  inputType: 'credit' | 'installment';
  value: number; // base value (credit)
  isBudgetBased: boolean; // Flag for budget-based simulations

  // Strategic Questions (Steps 3-5)
  aceleracao_strategy?: AceleracaoStrategy;
  parcela_preference?: ParcelaPreference;
  fundo_reserva_preference?: FundoReservaPreference;

  // Lance (Step 6-7)
  has_lance: boolean;
  lance_type: LanceType;
  lance_value: number;

  // Contact Info (Steps 9-11)
  priority: string;
  name: string;
  whatsapp: string;
  cpf: string;
  // Check-in Fields
  checkin_email?: string;
  checkin_phone?: string;
  checkin_birth?: string;
  checkin_cep?: string;
  checkin_address?: string;
  checkin_number?: string;
  checkin_neighborhood?: string;
  checkin_city?: string;
  checkin_state?: string;
  checkin_rg?: string;
  checkin_bank?: string;
  checkin_agency?: string;
  checkin_account?: string;
  tags: string[];
  finalRoute?: {
    title: string;
    monthly: number;
    term: number;
    credit: number;
    totalCost: number;
    groupProb: string;
    lanceLivre: number;
    lanceEmb: number;
  };
}

interface ChatState {
  view: View;
  messages: ChatMessage[];
  userData: UserData;
  modalOpen: boolean;
  stepIndex: number;
  inputType: 'text' | 'currency' | 'phone' | 'options' | 'hidden' | 'cpf';
  quickReplies?: { label: string; value: string }[];
  isTyping: boolean;
  activeModal: 'none' | 'how_it_works' | 'products' | 'contact';

  // Actions
  setView: (view: View) => void;
  addMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  updateUserData: (data: Partial<UserData>) => void;
  setModalOpen: (open: boolean) => void;
  setActiveModal: (modal: 'none' | 'how_it_works' | 'products' | 'contact') => void;
  setStepIndex: (idx: number) => void;
  setTyping: (typing: boolean) => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  view: 'PRE_SIM',
  messages: [],
  userData: {
    goal: '',
    usage: '',
    urgency: '',
    inputType: 'credit',
    value: 0,
    isBudgetBased: false,
    // Strategic fields initialized as undefined
    aceleracao_strategy: undefined,
    parcela_preference: undefined,
    fundo_reserva_preference: undefined,
    has_lance: false,
    lance_type: 'nada',
    lance_value: 0,
    priority: '',
    name: '',
    whatsapp: '',
    cpf: '',
    tags: [],
  },
  modalOpen: false,
  stepIndex: 0,
  inputType: 'hidden',
  quickReplies: [],
  isTyping: false,

  activeModal: 'none' as 'none' | 'how_it_works' | 'products' | 'contact',
  setActiveModal: (modal: 'none' | 'how_it_works' | 'products' | 'contact') => set({ activeModal: modal }),

  setView: (view) => set({ view }),
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7) }]
  })),
  updateUserData: (data) => set((state) => ({
    userData: { ...state.userData, ...data }
  })),
  setModalOpen: (open) => set({ modalOpen: open }),
  setStepIndex: (idx) => set({ stepIndex: idx }),
  setTyping: (typing) => set({ isTyping: typing }),
  resetChat: () => set({
    view: 'PRE_SIM',
    messages: [],
    userData: {
      goal: '',
      usage: '',
      urgency: '',
      inputType: 'credit',
      value: 0,
      isBudgetBased: false,
      aceleracao_strategy: undefined,
      parcela_preference: undefined,
      fundo_reserva_preference: undefined,
      has_lance: false,
      lance_type: 'nada',
      lance_value: 0,
      priority: '',
      name: '',
      whatsapp: '',
      cpf: '',
      tags: [],
    },
    modalOpen: false,
    activeModal: 'none',
    stepIndex: 0,
    inputType: 'hidden',
    quickReplies: []
  })
}));
