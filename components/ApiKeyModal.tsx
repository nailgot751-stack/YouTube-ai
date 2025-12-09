import React from 'react';

interface ApiKeyModalProps {
  onKeySelected: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    try {
      if(window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success if no error, check happens in parent or next render
        onKeySelected();
      } else {
        alert("AI Studio environment not detected.");
      }
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔑</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">API Key Required</h2>
        <p className="text-gray-300 mb-6">
          To use professional features like Veo Video Generation and High-Res Image Editing, you must select a valid Gemini API key associated with a billing-enabled Google Cloud Project.
        </p>
        
        <button
          onClick={handleSelectKey}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition transform hover:scale-105 shadow-lg"
        >
          Select API Key
        </button>

        <p className="mt-4 text-xs text-gray-500">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-purple-400"
          >
            Learn more about billing and API keys
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyModal;