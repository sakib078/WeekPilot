import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Sparkles, Loader2, ChevronDown, ChevronUp, Plus, Compass } from 'lucide-react';
import { FileInput, Role, UserProfile } from '../types';
import AudioRecorder from './AudioRecorder';

interface WeekSetupProps {
  onGenerate: (files: FileInput[], text: string, profile: UserProfile) => void;
  isLoading: boolean;
  initialFiles?: FileInput[];
  initialText?: string;
  initialProfile?: UserProfile;
}

const WeekSetup: React.FC<WeekSetupProps> = ({ 
  onGenerate, 
  isLoading, 
  initialFiles = [], 
  initialText = '', 
  initialProfile 
}) => {
  const [files, setFiles] = useState<FileInput[]>(initialFiles);
  const [textInput, setTextInput] = useState(initialText);
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    role: Role.STUDENT,
    timezone: '',
    workingHours: '9am-5pm Mon-Fri',
    hardEvents: ''
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FileInput[] = Array.from(e.target.files).map((file: File) => ({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        mimeType: file.type
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioTranscription = (text: string) => {
    setTextInput(prev => (prev ? `${prev}\n\n[Voice Note]: ${text}` : `[Voice Note]: ${text}`));
  };

  return (
    <div className="space-y-6">
      
      {/* Main Input Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600"/>
                WeekPilot Setup
             </h2>
             <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Inputs</span>
        </div>

        {/* Grid Layout for Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload Area */}
            <div className="flex flex-col">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    1. Upload Inputs
                </label>
                
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        flex-1 relative border-2 border-dashed rounded-xl transition-all cursor-pointer min-h-[160px] flex flex-col justify-center
                        ${files.length > 0 ? 'border-slate-200 bg-slate-50 p-3' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 p-6'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        accept="image/*,application/pdf"
                        onChange={handleFileChange} 
                    />
                    
                    {files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                                <Upload className="h-4 w-4 text-indigo-500" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">Drop files here</p>
                            <p className="text-xs text-slate-400">Screenshots, PDFs, Photos</p>
                        </div>
                    ) : (
                         <div className="grid grid-cols-3 gap-2">
                            {/* Add More Button */}
                            <div className="flex flex-col items-center justify-center aspect-square border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-400 transition-colors">
                                 <Plus className="w-5 h-5 mb-0.5"/>
                                 <span className="text-[10px] font-medium">Add</span>
                            </div>

                            {/* File Thumbnails */}
                            {files.map((f, i) => (
                                <div key={i} className="relative group/file aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                                    {f.mimeType.startsWith('image/') ? (
                                        <img src={f.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-red-500">
                                            <FileText className="w-6 h-6 mb-0.5" />
                                            <span className="text-[9px] uppercase font-bold text-slate-400">PDF</span>
                                        </div>
                                    )}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                        className="absolute top-0.5 right-0.5 p-0.5 bg-white/90 rounded-full text-slate-500 hover:text-red-500 shadow-sm opacity-0 group-hover/file:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>

            {/* Description Text Area */}
            <div className="flex flex-col">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    2. Describe your week
                </label>
                <div className="relative flex-1">
                    <textarea
                        className="w-full h-full min-h-[160px] text-sm rounded-xl border-slate-200 bg-slate-50 p-4 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow placeholder:text-slate-400/80 leading-relaxed"
                        placeholder="Type your brain dump here...&#10;• 3 assignments due Friday&#10;• Sprint review Thursday at 2pm"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3">
                         <AudioRecorder onTranscription={handleAudioTranscription} />
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Collapsible Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
        >
             <span className="font-bold text-slate-800 text-sm">Profile & constraints</span>
             {isProfileOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        
        {isProfileOpen && (
            <div className="p-5 pt-0 space-y-4 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                        <select 
                            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                            value={profile.role}
                            onChange={(e) => setProfile({ ...profile, role: e.target.value as Role })}
                        >
                            {Object.values(Role).map(role => (
                            <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Time Zone</label>
                        <input 
                            type="text" 
                            className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                            value={profile.timezone}
                            placeholder="e.g. EST"
                            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Working Hours & Fixed Events</label>
                    <textarea 
                        className="w-full text-sm rounded-lg border-slate-200 bg-slate-50 p-3 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                        value={profile.workingHours}
                        placeholder="e.g. 9-5 Mon-Fri, Standup daily at 10am"
                        onChange={(e) => setProfile({ ...profile, workingHours: e.target.value, hardEvents: e.target.value })}
                    />
                </div>
            </div>
        )}
      </div>

      {/* Primary Action */}
      <button
            onClick={() => onGenerate(files, textInput, profile)}
            disabled={isLoading || (files.length === 0 && !textInput)}
            className={`w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]
            ${isLoading || (files.length === 0 && !textInput)
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Charting course...
                </>
            ) : (
                <>
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    Generate Flight Plan
                </>
            )}
        </button>
        <p className="text-center text-xs text-slate-400">WeekPilot will analyze all files and draft your plan.</p>
    </div>
  );
};

export default WeekSetup;