import React from 'react';

export default function Products() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
                {/* Imóvel */}
                <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🏡</div>
                    <h3 className="text-2xl font-display font-bold mb-2">Imóveis</h3>
                    <p className="opacity-70 mb-4">
                        Para comprar, construir, reformar ou quitar financiamento.
                    </p>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li className="flex gap-2">✅ Casas e Apartamentos</li>
                        <li className="flex gap-2">✅ Terrenos</li>
                        <li className="flex gap-2">✅ Construção e Reforma</li>
                        <li className="flex gap-2">✅ Salas Comerciais</li>
                    </ul>
                </div>

                {/* Auto */}
                <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-2xl font-display font-bold mb-2">Automóveis</h3>
                    <p className="opacity-70 mb-4">
                        Carros novos e seminovos, leves ou pesados.
                    </p>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li className="flex gap-2">✅ Carros 0km</li>
                        <li className="flex gap-2">✅ Seminovos (até 10 anos)</li>
                        <li className="flex gap-2">✅ Caminhões</li>
                        <li className="flex gap-2">✅ Frotas corporativas</li>
                    </ul>
                </div>

                {/* Moto */}
                <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🏍️</div>
                    <h3 className="text-2xl font-display font-bold mb-2">Motos</h3>
                    <p className="opacity-70 mb-4">
                        Liberdade sobre duas rodas com parcelas que cabem no bolso.
                    </p>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li className="flex gap-2">✅ Todas as marcas</li>
                        <li className="flex gap-2">✅ Alta cilindrada</li>
                        <li className="flex gap-2">✅ Delivery e Trabalho</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
