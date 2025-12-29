
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/gemini';

const TranscriptionView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const gemini = GeminiService.getInstance();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setIsProcessing(true);
          try {
            const res = await gemini.transcribeAudio(base64);
            setTranscription(res);
          } catch (error) {
            console.error(error);
            setTranscription('Error transcribing audio.');
          } finally {
            setIsProcessing(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-outfit font-bold text-slate-800">Field Voice Notes</h2>
        <p className="text-slate-500">Record on-site findings, shingle types, and measurements. AI will transcribe and organize your notes with industry terminology.</p>
      </div>

      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-red-100 rounded-full animate-ping opacity-20"></div>
          </div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all ${
            isRecording ? 'bg-red-600 text-white scale-110' : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </button>
      </div>

      <div className="text-center">
        {isRecording ? (
          <p className="text-red-600 font-bold animate-pulse">Recording Site Notes...</p>
        ) : isProcessing ? (
          <p className="text-blue-600 font-bold">Gemini 3 Flash Transcribing...</p>
        ) : (
          <p className="text-slate-400 font-medium">Click to record notes</p>
        )}
      </div>

      {transcription && (
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-slideUp">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📝</span> Transcription Result
          </h3>
          <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap italic">
            "{transcription}"
          </div>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm">Create Inspection Log</button>
            <button 
              onClick={() => setTranscription(null)}
              className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 text-sm hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionView;
