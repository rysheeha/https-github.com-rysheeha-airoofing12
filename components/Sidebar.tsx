
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, toggle }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: AppView.CHAT, label: 'Claims Assistant', icon: '💬' },
    { id: AppView.ANALYSIS, label: 'Damage Analysis', icon: '🔍' },
    { id: AppView.VISUAL_STUDIO, label: 'Visual Studio', icon: '🎨' },
    { id: AppView.LIVE, label: 'Live Field Guide', icon: '🔴' },
    { id: AppView.GROUNDING, label: 'Code & Search', icon: '🌐' },
    { id: AppView.TRANSCRIPTION, label: 'Audio Notes', icon: '🎙️' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 flex flex-col h-full z-30`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl">R</span>
        </div>
        {isOpen && <h1 className="text-white font-outfit font-bold text-lg tracking-tight truncate">RoofIntel Pro</h1>}
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 px-4 py-3 text-slate-400 ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 bg-slate-700 rounded-full shrink-0"></div>
          {isOpen && (
            <div className="truncate">
              <p className="text-sm font-semibold text-white">Pro Contractor</p>
              <p className="text-xs">Premium Tier</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
