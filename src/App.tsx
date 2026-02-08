import React from 'react';
import Layout from './components/Layout';
import PreSimulation from './features/PreSimulation';
import ChatInterface from './features/Chat/ChatInterface';
import StrategyModal from './features/StrategyModal';
import { useChatStore } from './store/store';

function App() {
  const { view } = useChatStore();

  return (
    <Layout>
      {view === 'PRE_SIM' && <PreSimulation />}

      {view !== 'PRE_SIM' && (
        <ChatInterface />
      )}

      <StrategyModal />
    </Layout>
  );
}

export default App;
