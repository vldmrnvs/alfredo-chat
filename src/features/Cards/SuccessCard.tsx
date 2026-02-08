import React from 'react';
import { Trophy, MessageCircle, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useChatStore } from '../../store/store';

export default function SuccessCard() {
    const { userData } = useChatStore();
    const hash = "AF" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const whatsappUrl = `https://wa.me/5511999999935?text=${encodeURIComponent(`Ola, finalizei meu contrato! Hash:${hash}`)}`;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const route: any = userData.finalRoute || {};
        const date = new Date().toLocaleString();

        const html = `
            <html>
            <head>
                <title>Proposta Alfredo - ${userData.name}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #132116; background: #fff; }
                    .container { max-width: 800px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #94F6AD; padding-bottom: 20px; margin-bottom: 40px; }
                    .logo img { height: 40px; }
                    .tag { background: #E3FFEE; color: #2D4A3A; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                    h1 { font-size: 32px; margin-bottom: 5px; color: #132116; }
                    .subtitle { font-size: 14px; color: #666; margin-bottom: 30px; }
                    h2 { font-size: 16px; margin-top: 30px; margin-bottom: 20px; border-left: 4px solid #94F6AD; padding-left: 15px; text-transform: uppercase; letter-spacing: 1px; color: #2D4A3A; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; }
                    .box { background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #eee; }
                    .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
                    .value { font-size: 18px; font-weight: bold; color: #132116; }
                    .highlight { color: #059669; }
                    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #999; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">
                            <img src="/logo.svg" alt="Alfredo Consórcios" />
                        </div>
                        <div class="tag">Proposta Oficial</div>
                    </div>

                    <h1>Resumo da Estratégia</h1>
                    <p class="subtitle">Gerado automaticamente por Alfredo AI em ${date}</p>

                    <h2>Dados do Cliente</h2>
                    <div class="grid">
                         <div class="box">
                            <div class="label">Nome Completo</div>
                            <div class="value">${userData.name}</div>
                        </div>
                        <div class="box">
                            <div class="label">CPF</div>
                            <div class="value">${userData.cpf || '-'}</div>
                        </div>
                    </div>

                    <h2>Detalhes do Consórcio</h2>
                    <div class="grid">
                       <div class="box" style="background: #F0FDF4; border-color: #DCFCE7;">
                            <div class="label">Crédito Líquido</div>
                            <div class="value highlight" style="font-size: 24px;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.credit || userData.value)}</div>
                        </div>
                        <div class="box">
                            <div class="label">Estratégia</div>
                            <div class="value">${route.title || 'Personalizada'}</div>
                        </div>
                        <div class="box">
                            <div class="label">Prazo Estimado</div>
                            <div class="value">${route.term || '?'} meses</div>
                        </div>
                         <div class="box">
                            <div class="label">Parcela Mensal</div>
                            <div class="value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.monthly || 0)}</div>
                        </div>
                    </div>

                    <h2>Composição do Lance</h2>
                    <div class="grid">
                        <div class="box">
                            <div class="label">Lance do Bolso (Recurso Próprio)</div>
                            <div class="value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.lanceLivre || 0)}</div>
                        </div>
                        <div class="box">
                            <div class="label">Lance Embutido (Da Carta)</div>
                            <div class="value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.lanceEmb || 0)}</div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        Hash de Validação: <strong>${hash}</strong> • Alfredo Consórcios Inteligentes
                    </div>
                </div>

                <script>
                    window.onload = () => { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    const [showDetails, setShowDetails] = React.useState(false);
    const route: any = userData.finalRoute || {};

    return (
        <div className="w-full rounded-3xl p-8 mt-4 shadow-xl relative overflow-hidden message-enter border border-white/50 bg-gradient-to-br from-white to-[#E3FFEE]">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-600">
                <Trophy className="w-32 h-32" />
            </div>

            <p className="text-xs font-bold uppercase tracking-normal mb-2 text-[#2D4A3A]">
                Comprovante de Adesão
            </p>
            <h2 className="text-3xl font-display font-bold mb-6 tracking-normal text-[#132116]">
                Bem-vindo ao Grupo!
            </h2>

            <div className="bg-white/60 rounded-2xl p-4 mb-2 backdrop-blur-md border border-white/60 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1 tracking-normal">Hash de Transação</p>
                <p className="font-mono text-emerald-600 font-bold tracking-normal text-sm break-all">{hash}</p>
            </div>

            {/* Collapsible Details */}
            <div className="mb-6">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#2D4A3A] hover:opacity-75 transition py-2"
                >
                    <span>{showDetails ? 'Ocultar Detalhes' : 'Ver Detalhes da Proposta'}</span>
                    {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showDetails && (
                    <div className="bg-white/40 rounded-xl p-4 mt-2 border border-white/50 text-sm space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                            <span className="text-gray-600">Estratégia</span>
                            <span className="font-bold text-[#132116]">{route.title || 'Personalizada'}</span>
                        </div>
                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                            <span className="text-gray-600">Crédito</span>
                            <span className="font-bold text-emerald-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.credit || userData.value)}</span>
                        </div>
                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                            <span className="text-gray-600">Prazo</span>
                            <span className="font-bold text-[#132116]">{route.term || '?'} meses</span>
                        </div>
                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                            <span className="text-gray-600">Parcela</span>
                            <span className="font-bold text-[#132116]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.monthly || 0)}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-600">Lance Livre</span>
                            <span className="font-bold text-[#132116]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(route.lanceLivre || 0)}</span>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-600 mb-8 font-medium leading-relaxed tracking-normal">
                Você receberá o acesso ao portal do cliente no seu e-mail em até 24h.
            </p>

            <div className="space-y-3">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center font-bold py-4 rounded-full transition shadow-lg hover:translate-y-[-2px] bg-[#94F6AD] text-[#132116] flex items-center justify-center gap-2"
                >
                    <MessageCircle size={20} /> Acompanhar Processo
                </a>

                <button
                    onClick={handlePrint}
                    className="w-full text-center font-bold py-4 rounded-full transition shadow-sm border border-emerald-200 hover:bg-emerald-50 text-[#2D4A3A] flex items-center justify-center gap-2"
                >
                    <Download size={20} /> Baixar Proposta (PDF)
                </button>
            </div>
        </div>
    );
}
