import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  className?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscription, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setIsProcessing(true);
        const text = await transcribeAudio(audioBlob);
        onTranscription(text);
        setIsProcessing(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isProcessing ? (
        <div className="p-2 rounded-full bg-stone-100 text-stone-400" title="Transcribing...">
            <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : isRecording ? (
        <button
          onClick={stopRecording}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors animate-pulse border border-red-200"
          type="button"
          title="Stop recording"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          type="button"
          title="Dictate"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;