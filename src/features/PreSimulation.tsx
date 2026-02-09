import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Check } from 'lucide-react';
import { useChatStore } from '../store/store';

export default function PreSimulation() {
    const { setView, updateUserData } = useChatStore();

    const [selectedAsset, setSelectedAsset] = useState<'imovel' | 'auto' | 'moto' | ''>('');
    const [inputType, setInputType] = useState<'credit' | 'installment'>('credit');
    const [inputValue, setInputValue] = useState('');
    const [isBudgetBased, setIsBudgetBased] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (val: string) => {
        // Simple mask logic
        let v = val.replace(/\D/g, '');
        v = (parseInt(v) / 100).toFixed(2) + '';
        v = v.replace('.', ',');
        v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        return v === 'NaN' ? '' : v;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(formatCurrency(e.target.value));
        if (error) setError(null);
    };

    const handleAssetSelect = (asset: 'imovel' | 'auto' | 'moto') => {
        setSelectedAsset(asset);
        if (error) setError(null);
    };

    const toggleInputMode = () => {
        setInputType(prev => prev === 'credit' ? 'installment' : 'credit');
        setInputValue(''); // Reset value on toggle to avoid confusion
        if (error) setError(null);
    };

    const handleBudgetCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsBudgetBased(e.target.checked);
        if (e.target.checked) {
            setInputType('installment');
        } else {
            setInputType('credit');
        }
    };

    const startSimulation = () => {
        if (!selectedAsset) {
            setError('Por favor, selecione o tipo de bem (Imóvel, Auto ou Moto).');
            return;
        }
        if (!inputValue || inputValue === '0,00') {
            setError('Por favor, informe um valor válido para simulação.');
            return;
        }

        const cleanValue = parseFloat(inputValue.replace(/\./g, '').replace(',', '.'));

        updateUserData({
            goal: selectedAsset,
            inputType, // Persist which one it was
            value: cleanValue
        });

        // Start transition
        const screen = document.getElementById('pre-sim-screen');
        if (screen) {
            screen.classList.add('fade-out'); // You might need to add this class to CSS or animate differently in React
            setTimeout(() => setView('CHAT'), 300);
        } else {
            setView('CHAT');
        }
    };

    return (
        <div id="pre-sim-screen" className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col z-10 fade-in h-full relative w-full max-w-4xl mx-auto scrollbar-hide">
            {/* Header Content */}
            <div className="mt-4 pb-6">
                <div className="flex justify-start">
                    <div
                        className={
                            "rounded-full border border-black/5 bg-[#E3FFEE] text-base text-white transition-all ease-in"
                        }
                    >
                        <span className="text-xs font-bold px-4 py-1 inline-block animate-shiny-text bg-clip-text text-transparent bg-gradient-to-r from-[#2D4A3A] via-[#94F6AD] to-[#2D4A3A] bg-[length:200%_100%]">
                            ✨ Consultoria Digital
                        </span>
                    </div>
                </div>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-5 text-[#132116] tracking-tight">
                Qual o seu<br />próximo passo?
            </h2>
            <p className="leading-relaxed opacity-70 text-[#404040] pb-6">
                A inteligência artificial vai desenhar o melhor plano para você conquistar seu bem.
            </p>


            {/* Assets Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <button
                    onClick={() => handleAssetSelect('imovel')}
                    className={`asset-btn p-4 rounded-[2rem] flex flex-col items-center gap-3 group border-2 transition-all duration-300 relative overflow-hidden
                    ${selectedAsset === 'imovel'
                            ? 'border-[#94F6AD] bg-gradient-to-br from-[#F0FDF4] via-[#E3FFEE] to-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] scale-[0.98]'
                            : 'border-[#e5e5e5] hover:border-[#94F6AD]/50 hover:bg-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.02)]'
                        }`}
                >
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🏡</div>
                    <span className={`text-xs font-bold transition-colors ${selectedAsset === 'imovel' ? 'text-[#132116]' : 'text-[#404040] opacity-80 group-hover:opacity-100'}`}>Imóvel</span>
                    {selectedAsset === 'imovel' && <div className="absolute inset-0 border-2 border-[#94F6AD] rounded-[2rem] animate-border-pulse pointer-events-none" />}
                </button>
                <button
                    onClick={() => handleAssetSelect('auto')}
                    className={`asset-btn p-4 rounded-[2rem] flex flex-col items-center gap-3 group border-2 transition-all duration-300 relative overflow-hidden
                    ${selectedAsset === 'auto'
                            ? 'border-[#94F6AD] bg-gradient-to-br from-[#F0FDF4] via-[#E3FFEE] to-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] scale-[0.98]'
                            : 'border-transparent hover:border-[#94F6AD]/50 hover:bg-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.02)]'
                        }`}
                >
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🚗</div>
                    <span className={`text-xs font-bold transition-colors ${selectedAsset === 'auto' ? 'text-[#132116]' : 'text-[#404040] opacity-80 group-hover:opacity-100'}`}>Auto</span>
                    {selectedAsset === 'auto' && <div className="absolute inset-0 border-2 border-[#94F6AD] rounded-[2rem] animate-border-pulse pointer-events-none" />}
                </button>
                <button
                    onClick={() => handleAssetSelect('moto')}
                    className={`asset-btn p-4 rounded-[2rem] flex flex-col items-center gap-3 group border-2 transition-all duration-300 relative overflow-hidden
                     ${selectedAsset === 'moto'
                            ? 'border-[#94F6AD] bg-gradient-to-br from-[#F0FDF4] via-[#E3FFEE] to-white shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] scale-[0.98]'
                            : 'border-transparent hover:border-[#94F6AD]/50 hover:bg-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.02)]'
                        }`}
                >
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🏍️</div>
                    <span className={`text-xs font-bold transition-colors ${selectedAsset === 'moto' ? 'text-[#132116]' : 'text-[#404040] opacity-80 group-hover:opacity-100'}`}>Moto</span>
                    {selectedAsset === 'moto' && <div className="absolute inset-0 border-2 border-[#94F6AD] rounded-[2rem] animate-border-pulse pointer-events-none" />}
                </button>
            </div>

            {/* Input Area */}
            <div className="p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E5E5E5] mb-6 relative overflow-hidden group transition-colors bg-[#FAFAFA] flex-shrink-0">
                <div className="absolute top-0 left-0 w-1.5 h-full transition-colors bg-[#94F6AD]"></div>

                <div className="flex justify-between items-center mb-4">
                    <label className="font-bold text-sm tracking-tight opacity-80 text-[#132116]">
                        {inputType === 'credit' ? 'Valor do Crédito' : 'Parcela Mensal Ideal'}
                    </label>
                    <button
                        onClick={toggleInputMode}
                        className="text-xs font-bold hover:opacity-70 transition flex items-center gap-1 text-[#2D4A3A]"
                        disabled={isBudgetBased} // Disable toggle if checkbox is checked
                    >
                        <RefreshCw size={10} /> Alternar
                    </button>
                </div>

                <div className="relative flex items-baseline gap-1">
                    <span className="font-medium text-lg opacity-40">R$</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={inputValue}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none p-0 font-display font-bold text-3xl placeholder-gray-300 focus:ring-0 outline-none text-[#132116]"
                        placeholder={inputType === 'credit' ? "200.000,00" : "1.500,00"}
                    />
                </div>
            </div>

            {/* Checkbox */}
            <div className="mb-auto">
                <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
                    <div className="relative flex-shrink-0 flex items-center mt-0.5">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={isBudgetBased}
                            onChange={handleBudgetCheck}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-black peer-checked:border-black transition"></div>
                        {isBudgetBased && <Check size={12} className="text-white absolute top-1 left-1" />}
                    </div>
                    <span className="text-sm font-medium leading-tight opacity-60 group-hover:opacity-100 transition text-[#404040]">
                        Não sei o valor do bem, quero simular pelo <span className="font-bold text-black">valor da parcela</span>.
                    </span>
                </label>
            </div>

            {/* Error Message */}
            {
                error && (
                    <div className="text-red-500 text-sm font-medium text-center mb-2 mt-2 fade-in">
                        {error}
                    </div>
                )
            }

            {/* Start Button */}
            <button
                onClick={startSimulation}
                className="w-full btn-mint font-display font-bold text-lg py-5 rounded-full shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
                <span>Iniciar Simulação</span>
                <ArrowRight size={20} />
            </button>

        </div >
    );
}
