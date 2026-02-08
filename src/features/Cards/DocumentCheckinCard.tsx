import { useState } from 'react';
import { Camera, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { advanceFlow } from '../../services/chatService';
import { useChatStore } from '../../store/store';

export default function DocumentCheckinCard() {
    // const { userData } = useChatStore(); // Unused
    const [uploadStep, setUploadStep] = useState<'type' | 'front' | 'back' | 'validating'>('type');
    const [step, setStep] = useState<'upload' | 'validating' | 'form'>('upload');

    // Images held only for preview logic, no need to store permanent state if not used
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    const handleConfirm = () => {
        advanceFlow('docs_uploaded');
    };

    const handleTypeSelect = (_type: 'rg' | 'cnh') => {
        // setDocType(type); // Unused
        setUploadStep('front');
    };

    const handleUpload = () => {
        // Simulation: Set preview instead of direct confirm
        const mockUrl = uploadStep === 'front'
            ? 'https://placehold.co/600x400/e3ffee/2D4A3A/png?text=Frente+Capturada'
            : 'https://placehold.co/600x400/e3ffee/2D4A3A/png?text=Verso+Capturado';
        setPreviewImg(mockUrl);
    };

    const confirmPreview = () => {
        if (!previewImg) return;

        const { addMessage } = useChatStore.getState();

        if (uploadStep === 'front') {
            // setFrontImg(previewImg); // Unused
            // Immediate feedback in chat
            addMessage({ type: 'image', content: previewImg, sender: 'user' });

            setPreviewImg(null);
            setUploadStep('back');
        } else if (uploadStep === 'back') {
            // setBackImg(previewImg); // Unused
            // Immediate feedback in chat
            addMessage({ type: 'image', content: previewImg, sender: 'user' });

            setPreviewImg(null);
            setUploadStep('validating');
            setTimeout(() => {
                setStep('form'); // We will use this 'form' state to trigger "Done" ui
                handleConfirm(); // Advance immediately after validation visual
            }, 2000);
        }
    };

    const retryPreview = () => {
        setPreviewImg(null);
    };

    // If step is 'form' (meaning finished), show completed state
    if (step === 'form') {
        return (
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mt-3 shadow-sm text-center message-enter">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle size={24} />
                </div>
                <span className="text-[#132116] font-bold block">Documentos Enviados!</span>
            </div>
        );
    }

    if (step === 'upload' || step === 'validating') {
        if (uploadStep === 'validating') {
            return (
                <div className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition mt-2">
                    <Loader2 className="animate-spin text-2xl text-indigo-600 mx-auto w-8 h-8" />
                    <span className="text-indigo-600 font-bold block mt-2">Processando Imagens...</span>
                </div>
            );
        }

        if (uploadStep === 'type') {
            return (
                <div className="w-full mt-2 space-y-2">
                    <p className="text-sm font-bold text-gray-600 mb-2">Qual documento deseja enviar?</p>
                    <div className="flex gap-2">
                        <button onClick={() => handleTypeSelect('cnh')} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-[#132116] hover:bg-[#E3FFEE] hover:border-[#94F6AD] transition shadow-sm">
                            🚗 CNH
                        </button>
                        <button onClick={() => handleTypeSelect('rg')} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-[#132116] hover:bg-[#E3FFEE] hover:border-[#94F6AD] transition shadow-sm">
                            🪪 RG
                        </button>
                    </div>
                </div>
            );
        }

        // Preview Mode
        if (previewImg) {
            return (
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
                    <p className="text-sm font-bold text-[#132116] mb-3 text-center">
                        Verifique a foto ({uploadStep === 'front' ? 'Frente' : 'Verso'})
                    </p>
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-200 mb-4 border border-gray-300 shadow-inner">
                        <img src={previewImg} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={retryPreview}
                            className="flex-1 py-3 bg-white border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} /> Tentar Novamente
                        </button>
                        <button
                            onClick={confirmPreview}
                            className="flex-1 py-3 btn-mint rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
                        >
                            <CheckCircle size={18} /> Usar Foto
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div
                onClick={handleUpload}
                className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition mt-2 cursor-pointer hover:bg-gray-100 group"
            >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="text-xl text-[#2D4A3A]" />
                </div>
                <span className="text-[#132116] font-bold block">
                    {uploadStep === 'front' ? 'Enviar FRENTE do Documento' : 'Enviar VERSO do Documento'}
                </span>
                <span className="text-xs text-gray-400 mt-1 block">
                    Clique aqui para fazer o upload
                </span>
            </div>
        );
    }

    return null;
}

