import { Mail, MessageCircle } from 'lucide-react';


export default function Contact() {
    return (
        <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-display font-bold mb-8">Fale com a gente</h3>

            <div className="grid md:grid-cols-2 gap-6">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
                    className="p-8 rounded-[2rem] bg-[#E3FFEE] border border-[#94F6AD] flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                        <MessageCircle size={24} />
                    </div>
                    <span className="font-bold text-lg text-[#132116]">WhatsApp</span>
                    <span className="opacity-80">Atendimento rápido via chat</span>
                </a>

                <div className="p-8 rounded-[2rem] bg-white border border-gray-100 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#132116]">
                        <Mail size={24} />
                    </div>
                    <span className="font-bold text-lg text-[#132116]">E-mail</span>
                    <span className="opacity-80">contato@alfredo.com.vc</span>
                </div>
            </div>

            <div className="mt-12 opacity-60 text-sm">
                <p>Horário de atendimento: Segunda a Sexta, das 9h às 18h.</p>
            </div>
        </div>
    );
}
