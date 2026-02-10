
import Layout from './components/Layout';
import PreSimulation from './features/PreSimulation';
import ChatInterface from './features/Chat/ChatInterface';
import StrategyModal from './features/StrategyModal';
import { useChatStore } from './store/store';

import FullScreenModal from './components/FullScreenModal';
import HowItWorks from './components/modals/HowItWorks';
import Products from './components/modals/Products';
import Contact from './components/modals/Contact';
import PixelBlast from './components/PixelBlast';

function App() {
  const { view, activeModal, setActiveModal } = useChatStore();

  return (
    <Layout>
      {view === 'PRE_SIM' && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 z-0">
            <PixelBlast
              className="w-full h-full"
              pixelSize={2}
              color="#94f6ad"
              patternScale={1}
              patternDensity={1.3}
              enableRipples={true}
              rippleSpeed={0.35}
              rippleThickness={0.15}
              rippleIntensityScale={1.2}
              speed={0.9}
              transparent={true}
              edgeFade={0.4}
            />
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <PreSimulation />
          </div>
        </div>
      )}

      {view !== 'PRE_SIM' && (
        <ChatInterface />
      )}

      <StrategyModal />

      {/* Full Screen Modals */}
      <FullScreenModal
        isOpen={activeModal === 'how_it_works'}
        onClose={() => setActiveModal('none')}
        title="Como Funciona"
      >
        <HowItWorks />
      </FullScreenModal>

      <FullScreenModal
        isOpen={activeModal === 'products'}
        onClose={() => setActiveModal('none')}
        title="Nossos Produtos"
      >
        <Products />
      </FullScreenModal>

      <FullScreenModal
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal('none')}
        title="Contato"
      >
        <Contact />
      </FullScreenModal>
    </Layout>
  );
}

export default App;
