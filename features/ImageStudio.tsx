import React, { useState, useRef } from 'react';
import { generateImage, editImage } from '../services/geminiService';
import Loader from '../components/Loader';
import { AspectRatio, ImageResolution } from '../types';

const ImageStudio: React.FC = () => {
  const [mode, setMode] = useState<'GENERATE' | 'EDIT'>('GENERATE');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.R_1K);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleAction = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      if (mode === 'GENERATE') {
        const result = await generateImage(prompt, aspectRatio, resolution);
        setResultImage(result);
      } else {
        if (!selectedFile) throw new Error("Please select an image to edit.");
        const base64 = await convertBlobToBase64(selectedFile);
        const result = await editImage(base64, prompt, selectedFile.type);
        setResultImage(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Pro Image Studio</h2>
          <p className="text-gray-400">Powered by Gemini 3 Pro Image Preview</p>
        </div>
        <div className="bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setMode('GENERATE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === 'GENERATE' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setMode('EDIT')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === 'EDIT' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Edit Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            {mode === 'EDIT' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Source Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition relative overflow-hidden group"
                >
                  {previewSource ? (
                    <img src={previewSource} alt="Preview" className="mx-auto max-h-48 object-contain rounded" />
                  ) : (
                    <div className="py-8 text-gray-500">
                      <span className="text-2xl block mb-2">📁</span>
                      <p>Click to upload image</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-sm">Change Image</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'GENERATE' ? 'Prompt' : 'Edit Instruction'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'GENERATE' ? "A futuristic cyberpunk city..." : "Add a neon sign that says 'Open'..."}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none"
              />
            </div>

            {mode === 'GENERATE' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(AspectRatio).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 rounded border text-xs font-medium ${
                          aspectRatio === ratio
                            ? 'bg-purple-900/50 border-purple-500 text-purple-200'
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
                   <div className="grid grid-cols-3 gap-2">
                    {Object.values(ImageResolution).map((res) => (
                      <button
                        key={res}
                        onClick={() => setResolution(res)}
                        className={`py-2 rounded border text-xs font-medium ${
                          resolution === res
                            ? 'bg-purple-900/50 border-purple-500 text-purple-200'
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleAction}
              disabled={isLoading || !prompt || (mode === 'EDIT' && !selectedFile)}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                isLoading || !prompt
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50'
              }`}
            >
              {isLoading ? 'Processing...' : (mode === 'GENERATE' ? 'Generate Image' : 'Edit Image')}
            </button>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-1 flex items-center justify-center min-h-[500px] relative">
          {isLoading ? (
            <Loader text={mode === 'GENERATE' ? "Generating High-Res Image..." : "Applying Edits..."} />
          ) : resultImage ? (
            <div className="relative w-full h-full flex flex-col">
               <img 
                src={resultImage} 
                alt="Generated result" 
                className="w-full h-full object-contain max-h-[700px] rounded-lg bg-gray-900/50" 
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <a 
                  href={resultImage} 
                  download={`generated-image-${Date.now()}.png`}
                  className="px-4 py-2 bg-black/70 hover:bg-black/90 backdrop-blur text-white text-sm rounded-full flex items-center space-x-2 transition"
                >
                  <span>⬇️ Download</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <span className="text-4xl block mb-4">🖼️</span>
              <p>Your creation will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;