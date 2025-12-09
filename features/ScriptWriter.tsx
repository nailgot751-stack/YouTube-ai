import React, { useState } from 'react';
import { generateYouTubeScript } from '../services/geminiService';
import Loader from '../components/Loader';

const ScriptWriter: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Energetic & Engaging');
  const [script, setScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateYouTubeScript(topic, tone);
      setScript(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">AI Script Writer</h2>
        <p className="text-gray-400">Generate professional YouTube scripts with Gemini 2.5/3 Pro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Video Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Top 10 AI Tools for 2025"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          >
            <option>Energetic & Engaging</option>
            <option>Professional & Educational</option>
            <option>Funny & Sarcastic</option>
            <option>Dramatic & Storytelling</option>
            <option>Calm & Relaxing</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !topic}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
          isLoading || !topic
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
        }`}
      >
        {isLoading ? 'Thinking...' : 'Generate Script'}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {isLoading && <div className="mt-8"><Loader text="Crafting your script..." /></div>}

      {script && !isLoading && (
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Generated Script</h3>
          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">
            {script}
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(script)}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default ScriptWriter;