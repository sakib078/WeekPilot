import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Calendar } from 'lucide-react';

interface TaskPanelProps {
  markdown: string;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ markdown }) => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        Tasks & Deadlines
      </h3>
      <div className="markdown-body text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TaskPanel;