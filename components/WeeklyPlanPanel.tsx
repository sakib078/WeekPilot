import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sun, RotateCw, Loader2, Compass } from 'lucide-react';

interface WeeklyPlanPanelProps {
  todayFocusMarkdown: string;
  scheduleMarkdown: string;
  onRefreshToday: () => void;
  isRefreshing: boolean;
}

const WeeklyPlanPanel: React.FC<WeeklyPlanPanelProps> = ({ 
    todayFocusMarkdown, 
    scheduleMarkdown,
    onRefreshToday,
    isRefreshing
}) => {
  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      
      {/* Today Flight Plan Section */}
      <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm bg-indigo-50/30">
        <div className="flex items-center justify-between mb-3 border-b border-indigo-100 pb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Compass className="w-5 h-5 mr-2 text-indigo-600" />
                Today's Flight Plan
            </h3>
            <button
                onClick={onRefreshToday}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
                {isRefreshing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <RotateCw className="w-3.5 h-3.5" />
                )}
                {isRefreshing ? "Updating..." : "Update Flight Plan"}
            </button>
        </div>
        <div className="markdown-body text-sm text-slate-700">
            <ReactMarkdown>{todayFocusMarkdown}</ReactMarkdown>
        </div>
      </div>

      {/* Rest of the Week */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">
            The Rest of the Week
        </h3>
        <div className="markdown-body text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
            <ReactMarkdown>{scheduleMarkdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanPanel;