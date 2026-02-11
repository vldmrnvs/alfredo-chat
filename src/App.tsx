import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import PreSimulation from './features/PreSimulation';
import ChatInterface from './features/Chat/ChatInterface';
import { useChatStore } from './store/store';

// Lazy load heavy components
const PixelBlast = lazy(() => import('./components/PixelBlast'));
const StrategyModal = lazy(() => import('./features/StrategyModal'));
const FullScreenModal = lazy(() => import('./components/FullScreenModal'));
const HowItWorks = lazy(() => import('./components/modals/HowItWorks'));
const Products = lazy(() => import('./components/modals/Products'));
const Contact = lazy(() => import('./components/modals/Contact'));

function App() {
  const { view, activeModal, setActiveModal } = useChatStore();

  return (
    <Layout>
      {view === 'PRE_SIM' && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50" />}>
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
            </Suspense>
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <PreSimulation />
          </div>
        </div>
      )}

      {view !== 'PRE_SIM' && (
        <ChatInterface />
      )}

      <Suspense fallback={null}>
        <StrategyModal />
      </Suspense>

      {/* Full Screen Modals */}
      <Suspense fallback={null}>
        {activeModal === 'how_it_works' && (
          <FullScreenModal
            isOpen={true}
            onClose={() => setActiveModal('none')}
            title="Como Funciona"
          >
            <HowItWorks />
          </FullScreenModal>
        )}

        {activeModal === 'products' && (
          <FullScreenModal
            isOpen={true}
            onClose={() => setActiveModal('none')}
            title="Nossos Produtos"
          >
            <Products />
          </FullScreenModal>
        )}

        {activeModal === 'contact' && (
          <FullScreenModal
            isOpen={true}
            onClose={() => setActiveModal('none')}
            title="Contato"
          >
            <Contact />
          </FullScreenModal>
        )}
      </Suspense>
    </Layout>
  );
}

export default App;
