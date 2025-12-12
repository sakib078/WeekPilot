import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Zap } from 'lucide-react';

interface ActionPanelProps {
  markdown: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ markdown }) => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-purple-600" />
        Action Generators
      </h3>
      <div className="markdown-body text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
         <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ActionPanel;