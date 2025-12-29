
import React, { useState } from 'react';
import { GeminiService } from '../services/gemini';

const VisualStudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('New architectural shingles, charcoal grey, with proper flashing and ridge vents on a suburban home.');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [size, setSize] = useState('1K');
  const [isPortrait, setIsPortrait] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMedia, setGeneratedMedia] = useState<{type: 'image' | 'video', url: string} | null>(null);
  const [mode, setMode] = useState<'image' | 'video'>('image');

  const gemini = GeminiService.getInstance();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedMedia(null);

    try {
      // Check for billing/key selection if needed (handled by standard environment here)
      if (mode === 'image') {
        const url = await gemini.generateRoofImage(prompt, aspectRatio, size);
        setGeneratedMedia({ type: 'image', url });
      } else {
        const url = await gemini.generateRestorationVideo(prompt, isPortrait);
        setGeneratedMedia({ type: 'video', url });
      }
    } catch (error) {
      console.error(error);
      alert('Generation failed. Ensure API key has sufficient permissions.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button 
              onClick={() => setMode('image')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Roof Visualization
            </button>
            <button 
              onClick={() => setMode('video')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'video' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Process Video
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Visual Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                placeholder="Describe the roofing system or restoration scene..."
              />
            </div>

            {mode === 'image' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Aspect Ratio</label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {['1:1', '4:3', '3:4', '16:9', '9:16', '3:2', '2:3', '21:9'].map(ar => (
                      <option key={ar} value={ar}>{ar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Quality</label>
                  <select 
                    value={size} 
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <div>
                <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isPortrait} 
                    onChange={(e) => setIsPortrait(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Portrait Mode (9:16)</p>
                    <p className="text-xs text-slate-500">Perfect for homeowner mobile updates.</p>
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'image' ? 'Generating 4K...' : 'Rendering 1080p...'}
                </>
              ) : (
                <>
                  <span>✨</span> Generate {mode === 'image' ? 'Restoration Visual' : 'Process Clip'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[500px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            <span>Generated Media</span>
            {generatedMedia && (
              <a 
                href={generatedMedia.url} 
                download={`roofintel-${mode}-${Date.now()}`}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                Download Original
              </a>
            )}
          </h3>
          
          <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative">
            {isGenerating ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Veo Engine Rendering...</p>
                <p className="text-xs text-slate-400 max-w-xs mt-2">Generating professional restoration visuals can take up to 2-3 minutes. High fidelity is worth the wait.</p>
              </div>
            ) : generatedMedia ? (
              generatedMedia.type === 'video' ? (
                <video src={generatedMedia.url} controls className="max-w-full max-h-[600px] rounded-lg shadow-2xl" />
              ) : (
                <img src={generatedMedia.url} alt="Generated" className="max-w-full max-h-[600px] rounded-lg shadow-2xl" />
              )
            ) : (
              <div className="text-center text-slate-400">
                <div className="text-6xl mb-4">🎞️</div>
                <p className="font-medium">Enter a prompt and click generate.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">Elite Tip: Visual Supplements</h4>
              <p className="text-amber-800 text-xs leading-relaxed">
                Use Visual Studio to generate high-fidelity diagrams for supplemental requests. 
                Visualizing code-required components like specialized chimney flashing or 
                continuous ridge ventilation often speeds up adjuster approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualStudioView;
