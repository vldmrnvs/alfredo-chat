import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { advanceFlow } from '../../services/chatService';
import { useChatStore } from '../../store/store';

export default function CheckinFormCard() {
    const { userData } = useChatStore();
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleConfirm = () => {
        setSubmitted(true);
        setTimeout(() => {
            advanceFlow('form_completed');
        }, 1000);
    };

    // Helper for input classes
    const getInputClass = (id: string, baseClass = "input-mint-glass") => {
        return `${baseClass} ${errors[id] ? '!border-red-500 !bg-red-50' : ''}`;
    };

    const Label = ({ children, required }: { children: React.ReactNode, required?: boolean }) => (
        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">
            {children} {required && <span className="text-red-500 text-sm align-middle">*</span>}
        </label>
    );

    if (submitted) {
        return (
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-8 mt-3 shadow-sm text-center message-enter">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="font-bold text-lg text-[#132116] mb-2">Dados Enviados!</h3>
                <p className="text-gray-500 text-sm">Validando suas informações...</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mt-3 shadow-sm text-sm space-y-4 message-enter text-[#132116]">
            <h3 className="font-bold border-b pb-2 text-lg mb-2">Check-in Embracon</h3>
            <div className="grid grid-cols-1 gap-4 text-left">
                {/* Read Only / Pre-filled */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Nome</Label>
                        <input type="text" readOnly value={userData.name} className="input-mint-glass opacity-70" disabled />
                    </div>
                    <div>
                        <Label>CPF</Label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={userData.cpf || '000.000.000-00'}
                                className={`input-mint-glass opacity-70`}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Contacts */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label required>E-mail</Label>
                        <input id="chk-email" type="email" placeholder="seu@email.com" className={getInputClass("chk-email")} />
                    </div>
                    <div>
                        <Label required>WhatsApp</Label>
                        <input id="chk-phone" type="tel" defaultValue={userData.whatsapp} placeholder="(00) 00000-0000" className={getInputClass("chk-phone")} />
                    </div>
                </div>

                {/* Personal */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label required>Data Nasc.</Label>
                        <input id="chk-birth" type="date" className={getInputClass("chk-birth")} />
                    </div>
                    <div>
                        <Label required>RG</Label>
                        <input id="chk-rg" type="text" placeholder="00.000.000-0" className={getInputClass("chk-rg")} />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <Label required>CEP</Label>
                    <input id="chk-cep" type="text" placeholder="00000-000" className={getInputClass("chk-cep", "input-mint-glass w-1/2")} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3">
                        <Label required>Endereço</Label>
                        <input id="chk-addr" type="text" placeholder="Rua..." className={getInputClass("chk-addr")} />
                    </div>
                    <div>
                        <Label required>Nº</Label>
                        <input id="chk-num" type="text" className={getInputClass("chk-num")} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Bairro</Label>
                        <input id="chk-bairro" type="text" className="input-mint-glass" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                            <Label>Cidade</Label>
                            <input id="chk-city" type="text" className="input-mint-glass" />
                        </div>
                        <div>
                            <Label>UF</Label>
                            <input id="chk-uf" type="text" className="input-mint-glass" />
                        </div>
                    </div>
                </div>


                {/* Bank Data */}
                <div className="pt-2">
                    <p className="text-xs font-bold mb-2 uppercase tracking-wider text-[#132116]">Dados Bancários</p>
                    <input id="chk-bank" type="text" placeholder="Banco (Ex: Nubank)" className={getInputClass("chk-bank", "input-mint-glass mb-2")} />
                    <div className="flex gap-2">
                        <input id="chk-agency" type="text" placeholder="Agência" className={getInputClass("chk-agency")} />
                        <input id="chk-account" type="text" placeholder="Conta + Dígito" className={getInputClass("chk-account")} />
                    </div>
                </div>

                <button
                    onClick={() => {
                        // Capture all values
                        const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value || '';

                        const fields = {
                            email: getVal('chk-email'),
                            phone: getVal('chk-phone'),
                            birth: getVal('chk-birth'),
                            rg: getVal('chk-rg'),
                            cep: getVal('chk-cep'),
                            addr: getVal('chk-addr'),
                            num: getVal('chk-num'),
                            bank: getVal('chk-bank'),
                            agency: getVal('chk-agency'),
                            account: getVal('chk-account'),
                            // Optionals
                            bairro: getVal('chk-bairro'),
                            city: getVal('chk-city'),
                            uf: getVal('chk-uf')
                        };

                        // Validation
                        const newErrors: Record<string, boolean> = {};
                        if (!fields.email) newErrors['chk-email'] = true;
                        if (!fields.phone) newErrors['chk-phone'] = true;
                        if (!fields.birth) newErrors['chk-birth'] = true;
                        if (!fields.rg) newErrors['chk-rg'] = true;
                        if (!fields.cep) newErrors['chk-cep'] = true;
                        if (!fields.addr) newErrors['chk-addr'] = true;
                        if (!fields.num) newErrors['chk-num'] = true;
                        if (!fields.bank) newErrors['chk-bank'] = true;
                        if (!fields.agency) newErrors['chk-agency'] = true;
                        if (!fields.account) newErrors['chk-account'] = true;

                        setErrors(newErrors);

                        if (Object.keys(newErrors).length > 0) {
                            return; // Stop submission
                        }

                        const { updateUserData } = useChatStore.getState();
                        updateUserData({
                            checkin_email: fields.email,
                            checkin_phone: fields.phone,
                            checkin_birth: fields.birth,
                            checkin_rg: fields.rg,
                            checkin_cep: fields.cep,
                            checkin_address: fields.addr,
                            checkin_number: fields.num,
                            checkin_neighborhood: fields.bairro,
                            checkin_city: fields.city,
                            checkin_state: fields.uf,
                            checkin_bank: fields.bank,
                            checkin_agency: fields.agency,
                            checkin_account: fields.account
                        });

                        handleConfirm();
                    }}
                    className="w-full btn-mint font-bold py-4 rounded-full mt-4 shadow-lg flex items-center justify-center gap-2"
                >
                    Confirmar Dados <CheckCircle size={18} />
                </button>
            </div>
        </div>
    );
}
