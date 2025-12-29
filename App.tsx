
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import ChatView from './views/ChatView';
import AnalysisView from './views/AnalysisView';
import VisualStudioView from './views/VisualStudioView';
import LiveAssistantView from './views/LiveAssistantView';
import GroundingView from './views/GroundingView';
import TranscriptionView from './views/TranscriptionView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setActiveView} />;
      case AppView.CHAT:
        return <ChatView />;
      case AppView.ANALYSIS:
        return <AnalysisView />;
      case AppView.VISUAL_STUDIO:
        return <VisualStudioView />;
      case AppView.LIVE:
        return <LiveAssistantView />;
      case AppView.GROUNDING:
        return <GroundingView />;
      case AppView.TRANSCRIPTION:
        return <TranscriptionView />;
      default:
        return <Dashboard setView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeView={activeView} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
