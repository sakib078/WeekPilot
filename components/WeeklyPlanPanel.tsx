import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sun, RotateCw, Loader2 } from 'lucide-react';

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
      
      {/* Today Focus Section */}
      <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm bg-amber-50/30">
        <div className="flex items-center justify-between mb-3 border-b border-amber-100 pb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-amber-500" />
                Today Focus
            </h3>
            <button
                onClick={onRefreshToday}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
                {isRefreshing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                    <RotateCw className="w-3.5 h-3.5" />
                )}
                {isRefreshing ? "Refreshing..." : "Refresh Today Only"}
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