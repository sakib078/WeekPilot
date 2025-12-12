import React, { useState } from 'react';
import { FileInput, UserProfile, WeeklyPlanResponse, AppStatus } from './types';
import { generateWeeklyPlan, refreshTodayPlan, speakText } from './services/geminiService';
import TodayView from './components/TodayView';
import WorkspaceView from './components/WorkspaceView';
import { Layout, Calendar, Compass } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'today' | 'workspace'>('today');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<WeeklyPlanResponse | null>(null);
  
  // State for Inputs (Held at App level for "Fine-tune" and "Refresh" context)
  const [lastFiles, setLastFiles] = useState<FileInput[]>([]);
  const [lastText, setLastText] = useState<string>('');
  const [lastProfile, setLastProfile] = useState<UserProfile | null>(null);
  
  const [isRefreshingToday, setIsRefreshingToday] = useState(false);

  const handleGenerate = async (files: FileInput[], text: string, profile: UserProfile) => {
    setStatus(AppStatus.PROCESSING);
    setLastFiles(files);
    setLastText(text);
    setLastProfile(profile);
    
    try {
      const result = await generateWeeklyPlan(files, text, profile);
      setData(result);
      setStatus(AppStatus.SUCCESS);
      // Stay on workspace to see results
    } catch (e) {
      console.error(e);
      setStatus(AppStatus.ERROR);
      alert("Failed to generate plan. Please try again.");
    }
  };

  const handleRefreshToday = async () => {
    if (!lastFiles || !lastProfile) return;
    setIsRefreshingToday(true);
    try {
        const newTodayMarkdown = await refreshTodayPlan(lastFiles, lastText, lastProfile);
        setData(prev => prev ? { ...prev, today_focus_markdown: newTodayMarkdown } : null);
    } catch (e) {
        console.error(e);
        alert("Failed to refresh today's plan.");
    } finally {
        setIsRefreshingToday(false);
    }
  };

  const handleAddQuickTask = (task: string) => {
      setLastText(prev => prev ? `${prev}\n- [Manual Add]: ${task}` : `- [Manual Add]: ${task}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('today')}>
                <img 
                    src="logo.png" 
                    alt="WeekPilot Logo" 
                    className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                />
                <span className="font-bold text-xl text-slate-800 hidden sm:block tracking-tight">WeekPilot</span>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-full">
                <button 
                    onClick={() => setView('today')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        view === 'today' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Today
                </button>
                <button 
                    onClick={() => setView('workspace')}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        view === 'workspace' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Workspace
                </button>
            </div>
         </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
         {view === 'today' ? (
             <TodayView 
                data={data} 
                onOpenWorkspace={() => setView('workspace')} 
             />
         ) : (
             <WorkspaceView 
                onGenerate={handleGenerate}
                status={status}
                data={data}
                onRefreshToday={handleRefreshToday}
                isRefreshingToday={isRefreshingToday}
                onAddQuickTask={handleAddQuickTask}
                onBackToToday={() => setView('today')}
             />
         )}
      </main>
    </div>
  );
};

export default App;