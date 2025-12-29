
import React, { useState } from 'react';
import { GeminiService } from '../services/gemini';

const AnalysisView: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<{file: File, preview: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Analyze this roof photo for hail/wind damage and identify potential IRC code violations (e.g., drip edge, flashing, shingle overlap).');

  const gemini = GeminiService.getInstance();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMedia({
          file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!selectedMedia) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const base64Data = selectedMedia.preview.split(',')[1];
      const mimeType = selectedMedia.file.type;
      const res = await gemini.analyzeMedia(prompt, base64Data, mimeType);
      setResult(res || 'Analysis complete, but no text returned.');
    } catch (error) {
      console.error(error);
      setResult('Error during analysis. Please try a different file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Inspection Media</h3>
          <div 
            className={`aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
              selectedMedia ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            } cursor-pointer relative overflow-hidden`}
          >
            {selectedMedia ? (
              <>
                {selectedMedia.file.type.startsWith('video') ? (
                  <video src={selectedMedia.preview} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={selectedMedia.preview} alt="Preview" className="w-full h-full object-cover" />
                )}
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">📤</div>
                <p className="font-semibold text-slate-600">Drag & drop or click to upload</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, MP4 (Max 50MB)</p>
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,video/*" />
              </>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Analysis Parameters</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
          />
          <button
            onClick={analyze}
            disabled={!selectedMedia || isAnalyzing}
            className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing with Gemini 3 Pro...
              </>
            ) : (
              'Run Intelligence Engine'
            )}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col min-h-[400px]">
        <h3 className="font-bold text-slate-800 mb-4">Inspection Report</h3>
        {result ? (
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm">Download PDF</button>
              <button className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 py-3 rounded-xl font-bold text-sm">Share with Homeowner</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="text-5xl mb-4">📄</div>
            <p>Upload media and run analysis to generate report.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisView;
