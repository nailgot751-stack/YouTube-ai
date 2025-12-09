import React from 'react';

interface LoaderProps {
  text?: string;
  subText?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Generating...", subText }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full opacity-25"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-purple-300 animate-pulse">{text}</p>
        {subText && <p className="text-sm text-gray-400 mt-1">{subText}</p>}
      </div>
    </div>
  );
};

export default Loader;