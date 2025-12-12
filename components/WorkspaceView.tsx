import React, { useState } from 'react';
import { FileInput, UserProfile, WeeklyPlanResponse, AppStatus } from '../types';
import WeekSetup from './WeekSetup';
import TaskPanel from './TaskPanel';
import WeeklyPlanPanel from './WeeklyPlanPanel';
import ActionPanel from './ActionPanel';
import { ListTodo, Calendar, Zap, Plus, ArrowLeft } from 'lucide-react';

interface WorkspaceViewProps {
  onGenerate: (files: FileInput[], text: string, profile: UserProfile) => void;
  status: AppStatus;
  data: WeeklyPlanResponse | null;
  onRefreshToday: () => void;
  isRefreshingToday: boolean;
  onAddQuickTask: (task: string) => void;
  onBackToToday: () => void;
}

const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  onGenerate,
  status,
  data,
  onRefreshToday,
  isRefreshingToday,
  onAddQuickTask,
  onBackToToday
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'plan' | 'actions'>('plan');
  const [quickTask, setQuickTask] = useState('');

  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTask.trim()) {
        onAddQuickTask(quickTask.trim());
        setQuickTask('');
        alert("Task added to context! It will appear in the plan the next time you click 'Generate my week'.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
       
       {/* Mobile Header / Back Link */}
       <div className="lg:hidden col-span-1">
          <button onClick={onBackToToday} className="flex items-center text-stone-500 font-medium">
             <ArrowLeft className="w-4 h-4 mr-1" /> Back to Today
          </button>
       </div>

       {/* Left Column: Week Setup (Input) */}
       <div className="lg:col-span-5 xl:col-span-4">
          <WeekSetup onGenerate={onGenerate} isLoading={status === AppStatus.PROCESSING} />
       </div>

       {/* Right Column: Results */}
       <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-[600px]">
          {data ? (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col flex-1">
                 {/* Tab Header */}
                 <div className="flex border-b border-stone-100 bg-stone-50/50 p-1">
                    <button 
                        onClick={() => setActiveTab('tasks')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all
                        ${activeTab === 'tasks' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <ListTodo className="w-4 h-4" />
                        Tasks
                    </button>
                    <button 
                        onClick={() => setActiveTab('plan')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all
                        ${activeTab === 'plan' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <Calendar className="w-4 h-4" />
                        Plan
                    </button>
                    <button 
                        onClick={() => setActiveTab('actions')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all
                        ${activeTab === 'actions' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:bg-stone-100'}`}
                    >
                        <Zap className="w-4 h-4" />
                        Actions
                    </button>
                 </div>

                 {/* Tab Content */}
                 <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {activeTab === 'tasks' && <TaskPanel markdown={data.tasks_deadlines_markdown} />}
                    {activeTab === 'plan' && <WeeklyPlanPanel 
                                todayFocusMarkdown={data.today_focus_markdown} 
                                scheduleMarkdown={data.week_schedule_markdown}
                                onRefreshToday={onRefreshToday}
                                isRefreshing={isRefreshingToday}
                            />}
                    {activeTab === 'actions' && <ActionPanel markdown={data.action_generators_markdown} />}
                 </div>

                 {/* Fine-tune Section */}
                 <div className="border-t border-stone-100 p-4 bg-stone-50">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">Fine-tune next run</h4>
                    <form onSubmit={handleAddQuickTask} className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 text-sm rounded-lg border-stone-200 p-2 focus:ring-stone-400 focus:border-stone-400"
                            placeholder="Add a quick task (e.g. 'Call Mom tomorrow')"
                            value={quickTask}
                            onChange={(e) => setQuickTask(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 p-2 rounded-lg transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>
                 </div>
              </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-stone-200 border-dashed">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                    <Calendar className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-700 mb-2">Your week is waiting</h3>
                <p className="max-w-md text-stone-500">Upload your mess on the left, and we'll turn it into a clear, actionable plan right here.</p>
            </div>
          )}
       </div>
    </div>
  );
};

export default WorkspaceView;