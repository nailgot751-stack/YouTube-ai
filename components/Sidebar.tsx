import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: AppView.SCRIPT_WRITER, label: 'Script Writer', icon: '📝' },
    { id: AppView.IMAGE_STUDIO, label: 'Image Studio', icon: '🎨' },
    { id: AppView.VIDEO_GENERATOR, label: 'Video Generator', icon: '🎥' },
  ];

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col border-r border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          CreatorPro AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Powered by Gemini Pro</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              currentView === item.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Systems Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;