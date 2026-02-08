import { useChatStore } from '../../store/store';

export default function StrategiesCard() {
    const { setModalOpen } = useChatStore();

    // These should match the routes in StrategyModal, or ideally come from a shared constant/store
    const routes = [
        { id: 'longevidade', icon: '📅', title: 'Parcela Menor', desc: 'Foco no longo prazo.' },
        { id: 'embutido', icon: '🧩', title: 'Lance Embutido', desc: 'Use a própria carta.' },
        { id: 'rapida', icon: '🚀', title: 'Aceleração', desc: 'Grupo em andamento.' }
    ];

    const handleSelect = () => {
        // In a real scenario, we might want to pre-select the route in the modal
        // For now, just opening the modal is enough as the modal defaults to the first one or handles logic
        setModalOpen(true);
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {routes.map((route) => (
                <button
                    key={route.id}
                    onClick={() => handleSelect()}
                    className="flex-shrink-0 w-40 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group snap-center"
                >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{route.icon}</div>
                    <h3 className="font-bold text-sm text-[#132116] leading-tight mb-1">{route.title}</h3>
                    <p className="text-[10px] text-gray-500 leading-tight">{route.desc}</p>
                </button>
            ))}
        </div>
    );
}
