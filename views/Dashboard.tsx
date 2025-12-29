
import React from 'react';
import { AppView } from '../types';

interface DashboardProps {
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const stats = [
    { label: 'Active Claims', value: '14' },
    { label: 'Pending Code Reviews', value: '3' },
    { label: 'Saved Media Files', value: '128' },
    { label: 'Transcription Hrs', value: '4.5' },
  ];

  const quickActions = [
    { id: AppView.CHAT, title: 'IRC Code Consultation', desc: 'Ask complex code or policy questions with thinking mode.', icon: '⚖️', color: 'bg-indigo-500' },
    { id: AppView.ANALYSIS, title: 'Analyze Roof Photos', desc: 'Detect hail, wind damage, and code violations instantly.', icon: '📸', color: 'bg-emerald-500' },
    { id: AppView.LIVE, title: 'On-Site Live Guide', icon: '📱', desc: 'Real-time voice and video walkthrough of storm damage.', color: 'bg-rose-500' },
    { id: AppView.VISUAL_STUDIO, title: 'Media Production', icon: '🎬', desc: 'Generate marketing videos or visualize repair scopes.', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-outfit font-bold mb-4">Welcome back, Chief Restorer.</h2>
        <p className="text-slate-300 max-w-2xl mb-8">
          The roofing restoration landscape is evolving. Leverage elite AI to automate policy interpretation, 
          code compliance, and field assessments.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Quick Intelligence Launchpad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setView(action.id)}
              className="bg-white border border-slate-200 p-6 rounded-2xl text-left hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{action.title}</h4>
              <p className="text-sm text-slate-500 line-clamp-2">{action.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-4">Recent Industry Updates</h3>
          <div className="space-y-4">
            {[
              { tag: 'CODE', title: 'IRC 2024 Updates: Changes to Ice and Water Shield Requirements', date: '2 days ago' },
              { tag: 'POLICY', title: 'Carrier Trends: Rise in Cosmetic Damage Endorsements for Metal Roofs', date: '4 days ago' },
              { tag: 'TECH', title: 'Drones vs. Hand Inspections: New Best Practices for Claim Documentation', date: '1 week ago' },
            ].map((news, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl cursor-pointer">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold mt-1">{news.tag}</span>
                <div>
                  <h5 className="font-semibold text-slate-800 text-sm">{news.title}</h5>
                  <p className="text-xs text-slate-500">{news.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold mb-2">Field Live Assistant</h3>
            <p className="text-sm text-blue-100 mb-4">
              Need eyes on a weird flashing detail? Start a live session and get code compliance verification instantly.
            </p>
          </div>
          <button 
            onClick={() => setView(AppView.LIVE)}
            className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Launch Field Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
