import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './features/Dashboard';
import VideoGenerator from './features/VideoGenerator';
import ImageStudio from './features/ImageStudio';
import ScriptWriter from './features/ScriptWriter';
import ApiKeyModal from './components/ApiKeyModal';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [hasKey, setHasKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);

  const checkKey = async () => {
    setCheckingKey(true);
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback for dev environments without the specific wrapper, 
        // though strict instructions say assume it exists.
        // We set false to force modal logic if the wrapper exists but returns false.
        setHasKey(false); 
      }
    } catch (e) {
      console.error("Error checking API key status", e);
      setHasKey(false);
    } finally {
      setCheckingKey(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case AppView.VIDEO_GENERATOR:
        return <VideoGenerator />;
      case AppView.IMAGE_STUDIO:
        return <ImageStudio />;
      case AppView.SCRIPT_WRITER:
        return <ScriptWriter />;
      case AppView.DASHBOARD:
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (checkingKey) {
    return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Loading System...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {!hasKey && <ApiKeyModal onKeySelected={checkKey} />}
      
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 h-full overflow-hidden bg-gray-900 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;