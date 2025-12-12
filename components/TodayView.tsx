import React, { useState } from 'react';
import { WeeklyPlanResponse } from '../types';
import { CheckCircle2, AlertCircle, Calendar, ArrowRight, Layout, Compass } from 'lucide-react';

interface TodayViewProps {
  data: WeeklyPlanResponse | null;
  onOpenWorkspace: () => void;
}

const TodayView: React.FC<TodayViewProps> = ({ data, onOpenWorkspace }) => {
  // Simple local state to toggle checkboxes (ephemeral)
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newSet = new Set(completedItems);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setCompletedItems(newSet);
  };

  const completedCount = completedItems.size;
  const totalFocus = data?.today_focus_items?.length || 0;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm mb-2 border border-slate-100">
            <Compass className="w-12 h-12 text-indigo-300" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Good Morning</h2>
            <p className="text-slate-500 max-w-xs mx-auto">
            Ready to chart your course? Head to the workspace to generate your flight plan.
            </p>
        </div>
        <button
          onClick={onOpenWorkspace}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          Open Workspace
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">WeekPilot</h1>
        <p className="text-slate-500 font-medium">Turn digital chaos into a guided week.</p>
      </header>

      {/* Today Flight Plan Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Today's Flight Plan
          </h2>
          {totalFocus > 0 && (
             <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {completedCount}/{totalFocus} complete
             </span>
          )}
        </div>
        <div className="space-y-3">
          {data.today_focus_items.length > 0 ? (
            data.today_focus_items.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => toggleItem(item)}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer border ${
                    completedItems.has(item) 
                    ? 'bg-slate-50 border-slate-100' 
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    completedItems.has(item) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'
                }`}>
                    {completedItems.has(item) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm font-medium leading-tight ${completedItems.has(item) ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No specific flight plan items found.</p>
          )}
        </div>
      </div>

      {/* Due Today Card */}
      {data.due_today_items && data.due_today_items.length > 0 && (
        <div className="bg-red-50/50 rounded-2xl p-6 shadow-sm border border-red-100">
            <h2 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Urgent & Due Today
            </h2>
            <ul className="space-y-2">
                {data.due_today_items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-red-700 font-medium">
                        <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
      )}

      {/* Week Glance Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
         <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            This week at a glance
         </h2>
         <div className="flex justify-between items-end gap-1">
            {data.week_glance.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                        className="w-full bg-slate-100 rounded-t-md relative group transition-all hover:bg-teal-100"
                        style={{ height: `${Math.min(day.taskCount * 12, 60) + 10}px` }}
                    >
                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {day.taskCount}
                         </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                        {day.day}
                    </span>
                </div>
            ))}
         </div>
      </div>

      {/* Open Workspace Button */}
      <div className="pt-4 flex justify-center">
         <button
            onClick={onOpenWorkspace}
            className="text-slate-600 hover:text-indigo-600 font-medium text-sm flex items-center gap-2 transition-colors"
         >
            Go to full workspace
            <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

export default TodayView;