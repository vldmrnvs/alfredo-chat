import React from 'react';

export default function HowItWorks() {
    return (
        <div className="max-w-3xl mx-auto text-[#132116]">
            <h3 className="text-3xl font-display font-bold mb-6">Como funciona o Consórcio Inteligente?</h3>

            <div className="space-y-8">
                <section>
                    <h4 className="text-xl font-bold mb-2 text-[#2D4A3A]">1. Simulação com IA</h4>
                    <p className="text-lg opacity-80 leading-relaxed">
                        Nossa inteligência artificial analisa seu perfil financeiro e seus objetivos (imóvel, auto ou moto) para encontrar a melhor estratégia de consórcio para você.
                    </p>
                </section>

                <section>
                    <h4 className="text-xl font-bold mb-2 text-[#2D4A3A]">2. Planejamento de Lance</h4>
                    <p className="text-lg opacity-80 leading-relaxed">
                        Calculamos as probabilidades de contemplação com base em dados históricos e definimos o lance ideal, seja ele livre (recursos próprios) ou embutido (parte da carta).
                    </p>
                </section>

                <section>
                    <h4 className="text-xl font-bold mb-2 text-[#2D4A3A]">3. Acompanhamento</h4>
                    <p className="text-lg opacity-80 leading-relaxed">
                        Após a adesão, nossa equipe acompanha mensalmente as assembleias e te orienta sobre o melhor momento para ofertar lances, maximizando suas chances.
                    </p>
                </section>

                <div className="p-6 bg-[#E3FFEE] rounded-2xl border border-[#94F6AD]">
                    <p className="font-bold text-[#2D4A3A] text-center">
                        Sem juros, sem entrada abusiva e com taxas justas. O jeito mais inteligente de construir patrimônio.
                    </p>
                </div>
            </div>
        </div>
    );
}
