
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  activeView: AppView;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, toggleSidebar }) => {
  const titles: Record<AppView, string> = {
    [AppView.DASHBOARD]: 'Intelligence Dashboard',
    [AppView.CHAT]: 'Elite Claims Assistant',
    [AppView.ANALYSIS]: 'Smart Damage Analysis',
    [AppView.VISUAL_STUDIO]: 'Restoration Media Studio',
    [AppView.LIVE]: 'Field Live Stream Assistant',
    [AppView.GROUNDING]: 'Regulatory & Field Grounding',
    [AppView.TRANSCRIPTION]: 'Smart Audio Transcription'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          ☰
        </button>
        <h2 className="font-outfit text-xl font-semibold text-slate-800">{titles[activeView]}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          AI Engine Active
        </div>
        <button className="p-2 text-slate-500 hover:text-slate-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
