
import React, { useState } from 'react';
import { GeminiService } from '../services/gemini';
import { GroundingResult } from '../types';

const GroundingView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{text: string, sources: GroundingResult[]} | null>(null);
  const [mode, setMode] = useState<'search' | 'maps'>('search');

  const gemini = GeminiService.getInstance();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      if (mode === 'search') {
        const res = await gemini.searchGrounding(query);
        setResult(res);
      } else {
        // Mock location for maps if needed, or get from navigator
        const res = await gemini.mapsGrounding(query);
        setResult(res);
      }
    } catch (error) {
      console.error(error);
      alert('Search failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-10">
        <h2 className="text-3xl font-outfit font-bold text-slate-800 mb-4">Regulatory Intelligence</h2>
        <p className="text-slate-500">Search current building codes, manufacturer specs, and local requirements with verified sources.</p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl space-y-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mx-auto">
          <button 
            onClick={() => setMode('search')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'search' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Google Search Grounding
          </button>
          <button 
            onClick={() => setMode('maps')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'maps' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Google Maps Grounding
          </button>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={mode === 'search' ? "e.g., Florida building code 2024 roof ventilation requirements" : "e.g., Roofing supply stores in Miami with Owens Corning stock"}
            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all text-slate-800"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg"
          >
            {isLoading ? 'Verifying...' : 'Search'}
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">AI Synthesis</h3>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {result.text}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Verified Sources</h3>
            <div className="space-y-3">
              {result.sources.length > 0 ? (
                result.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block bg-white border border-slate-200 p-3 rounded-xl hover:border-blue-500 transition-all group"
                  >
                    <p className="text-xs font-bold text-blue-600 mb-1 group-hover:underline truncate">{source.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{source.uri}</p>
                  </a>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No specific source links provided in this response.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroundingView;
