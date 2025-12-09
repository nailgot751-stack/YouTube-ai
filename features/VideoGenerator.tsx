import React, { useState, useRef } from 'react';
import { generateVideo, generateVideoFromImage } from '../services/geminiService';
import Loader from '../components/Loader';

const VideoGenerator: React.FC = () => {
  const [mode, setMode] = useState<'TEXT' | 'IMAGE'>('TEXT');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  
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

  const handleGenerate = async () => {
    if (mode === 'TEXT' && !prompt) return;
    if (mode === 'IMAGE' && !selectedFile) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      let url: string;
      if (mode === 'TEXT') {
        url = await generateVideo(prompt, aspectRatio);
      } else {
        if (!selectedFile) throw new Error("Please select an image.");
        url = await generateVideoFromImage(prompt, selectedFile, selectedFile.type, aspectRatio);
      }
      setVideoUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Veo Video Studio</h2>
          <p className="text-gray-400">Professional AI Video Generation & Editing</p>
        </div>
        <div className="bg-gray-800 p-1 rounded-lg inline-flex self-start md:self-center">
          <button
            onClick={() => setMode('TEXT')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === 'TEXT' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Text to Video
          </button>
          <button
            onClick={() => setMode('IMAGE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              mode === 'IMAGE' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Image to Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            
            {mode === 'IMAGE' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Source Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition relative overflow-hidden group min-h-[160px] flex items-center justify-center"
                >
                  {previewSource ? (
                    <img src={previewSource} alt="Preview" className="max-h-40 object-contain rounded shadow-lg" />
                  ) : (
                    <div className="text-gray-500">
                      <span className="text-2xl block mb-2">📁</span>
                      <p>Upload image to animate</p>
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
                    <span className="text-white text-sm font-semibold">Change Image</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'TEXT' ? 'Video Prompt' : 'Animation Prompt (Optional)'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === 'TEXT' 
                  ? "A cinematic drone shot of a futuristic cyberpunk city..." 
                  : "Camera pans slowly, leaves blowing in the wind..."}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none h-32 resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    aspectRatio === '16:9'
                      ? 'bg-pink-900/50 border-pink-500 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="w-8 h-5 border-2 border-current rounded-sm"></div>
                  <span className="text-xs font-medium">YouTube (16:9)</span>
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                    aspectRatio === '9:16'
                      ? 'bg-pink-900/50 border-pink-500 text-white'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="w-5 h-8 border-2 border-current rounded-sm"></div>
                  <span className="text-xs font-medium">Shorts (9:16)</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || (mode === 'TEXT' && !prompt) || (mode === 'IMAGE' && !selectedFile)}
              className={`w-full py-3 rounded-lg font-bold transition-all ${
                isLoading || (mode === 'TEXT' && !prompt) || (mode === 'IMAGE' && !selectedFile)
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500 shadow-lg hover:shadow-pink-500/25'
              }`}
            >
              {isLoading ? 'Processing...' : (mode === 'TEXT' ? 'Generate Video' : 'Animate Image')}
            </button>
            {error && <p className="text-red-400 text-sm mt-3 bg-red-900/20 p-2 rounded border border-red-500/30">{error}</p>}
          </div>
        </div>

        <div className="lg:col-span-2 bg-black rounded-xl border border-gray-800 flex items-center justify-center min-h-[500px] overflow-hidden relative">
          {isLoading ? (
            <Loader 
              text={mode === 'TEXT' ? "Generating Video..." : "Animating Image..."} 
              subText="Powered by Veo. This may take 1-2 minutes." 
            />
          ) : videoUrl ? (
            <div className="w-full h-full flex flex-col">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 right-4">
                 <a 
                  href={videoUrl} 
                  download={`veo-generation-${Date.now()}.mp4`}
                  className="bg-black/60 backdrop-blur hover:bg-black/90 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition border border-white/10"
                 >
                   <span>⬇️</span> Download MP4
                 </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <span className="text-6xl block mb-4 grayscale opacity-50">🎬</span>
              <p className="text-xl font-medium text-gray-500">Your masterpiece awaits</p>
              <p className="text-sm text-gray-600 mt-2">Generate high-quality video from text or images</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
