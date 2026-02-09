
import Layout from './components/Layout';
import PreSimulation from './features/PreSimulation';
import ChatInterface from './features/Chat/ChatInterface';
import StrategyModal from './features/StrategyModal';
import { useChatStore } from './store/store';

import FullScreenModal from './components/FullScreenModal';
import HowItWorks from './components/modals/HowItWorks';
import Products from './components/modals/Products';
import Contact from './components/modals/Contact';

function App() {
  const { view, activeModal, setActiveModal } = useChatStore();

  return (
    <Layout>
      {view === 'PRE_SIM' && <PreSimulation />}

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
