import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Sparkles, Loader2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
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
      <div className="bg-white p-1 rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/30 flex items-center justify-between">
             <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500"/>
                Week Context
             </h2>
             <span className="text-xs font-medium text-stone-400">Files & Notes</span>
        </div>

        <div className="p-6 space-y-8">
            {/* File Upload Area */}
            <div className="group">
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">
                    1. Upload Inputs
                </label>
                
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer min-h-[120px]
                        ${files.length > 0 ? 'border-stone-200 bg-white' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'}
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
                        <div className="flex flex-col items-center justify-center py-4 h-full">
                             <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                                <Upload className="h-5 w-5 text-stone-400" />
                            </div>
                            <p className="text-sm font-medium text-stone-600">Drop screenshots, PDFs, or photos</p>
                            <p className="text-xs text-stone-400 mt-1">We'll extract tasks & deadlines</p>
                        </div>
                    ) : (
                         <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {/* Add More Button */}
                            <div className="flex flex-col items-center justify-center aspect-square border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-400 transition-colors">
                                 <Plus className="w-6 h-6 mb-1"/>
                                 <span className="text-[10px] font-medium">Add</span>
                            </div>

                            {/* File Thumbnails */}
                            {files.map((f, i) => (
                                <div key={i} className="relative group/file aspect-square rounded-lg border border-stone-200 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                                    {f.mimeType.startsWith('image/') ? (
                                        <img src={f.previewUrl} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-red-500">
                                            <FileText className="w-8 h-8 mb-1" />
                                            <span className="text-[10px] uppercase font-bold text-stone-400">PDF</span>
                                        </div>
                                    )}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-stone-500 hover:text-red-500 shadow-sm opacity-0 group-hover/file:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-2 py-1 text-[9px] truncate text-stone-600 text-center font-medium">
                                        {f.file.name}
                                    </div>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>

            {/* Description Text Area */}
            <div>
                 <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 ml-1">
                    2. Describe your week
                </label>
                <div className="relative">
                    <textarea
                        className="w-full text-sm rounded-xl border-stone-200 bg-stone-50 p-4 pr-12 focus:ring-2 focus:ring-stone-400 focus:border-stone-400 min-h-[140px] resize-none transition-shadow placeholder:text-stone-400/80 leading-relaxed"
                        placeholder="Type your brain dump here...&#10;• 3 assignments due Friday&#10;• Sprint review Thursday at 2pm&#10;• Need to finish feature X"
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
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
        >
             <span className="font-bold text-stone-800 text-sm">Profile & constraints</span>
             {isProfileOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
        </button>
        
        {isProfileOpen && (
            <div className="p-5 pt-0 space-y-4 border-t border-stone-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1.5">Role</label>
                        <select 
                            className="w-full text-sm rounded-lg border-stone-200 bg-stone-50 p-2.5 focus:ring-stone-400 focus:border-stone-400"
                            value={profile.role}
                            onChange={(e) => setProfile({ ...profile, role: e.target.value as Role })}
                        >
                            {Object.values(Role).map(role => (
                            <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-stone-500 mb-1.5">Time Zone</label>
                        <input 
                            type="text" 
                            className="w-full text-sm rounded-lg border-stone-200 bg-stone-50 p-2.5 focus:ring-stone-400 focus:border-stone-400"
                            value={profile.timezone}
                            placeholder="e.g. EST"
                            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">Working Hours & Fixed Events</label>
                    <textarea 
                        className="w-full text-sm rounded-lg border-stone-200 bg-stone-50 p-3 focus:ring-stone-400 focus:border-stone-400 min-h-[80px]"
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
                ? 'bg-stone-300 cursor-not-allowed shadow-none' 
                : 'bg-stone-800 hover:bg-stone-900'
            }`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Thinking deeply...
                </>
            ) : (
                <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    Generate my week
                </>
            )}
        </button>
    </div>
  );
};

export default WeekSetup;