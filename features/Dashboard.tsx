import React from 'react';
import { AppView } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
          Welcome to CreatorStudio Pro
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          The ultimate AI-powered suite for YouTube creators. Generate scripts, visualize ideas, edit images, and create cinematic videos in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Script Card */}
        <div 
          onClick={() => onNavigate(AppView.SCRIPT_WRITER)}
          className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 hover:bg-gray-800/80 transition cursor-pointer group"
        >
          <div className="w-14 h-14 bg-blue-900/50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
            📝
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Script Writer</h3>
          <p className="text-gray-400">
            Generate engaging YouTube scripts with hooks, intros, and calls to action using Gemini Pro.
          </p>
        </div>

        {/* Image Card */}
        <div 
          onClick={() => onNavigate(AppView.IMAGE_STUDIO)}
          className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 hover:bg-gray-800/80 transition cursor-pointer group"
        >
          <div className="w-14 h-14 bg-purple-900/50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
            🎨
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Image Studio</h3>
          <p className="text-gray-400">
            Generate 4K thumbnails or edit existing images with simple text instructions.
          </p>
        </div>

        {/* Video Card */}
        <div 
          onClick={() => onNavigate(AppView.VIDEO_GENERATOR)}
          className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 hover:bg-gray-800/80 transition cursor-pointer group"
        >
          <div className="w-14 h-14 bg-pink-900/50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
            🎥
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Veo Generator</h3>
          <p className="text-gray-400">
            Create high-definition videos from text prompts for your b-roll or Shorts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;