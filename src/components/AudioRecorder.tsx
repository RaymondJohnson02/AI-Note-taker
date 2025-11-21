"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onAudioCaptured: (audioBlob: Blob) => void;
  isProcessing: boolean;
}

export function AudioRecorder({ onAudioCaptured, isProcessing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onAudioCaptured(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please ensure you have granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Record Meeting</h3>
        <p className="text-sm text-gray-500">
          {isRecording ? "Recording in progress..." : "Click the microphone to start recording"}
        </p>
      </div>

      <div className="relative mb-6">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-75"></div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
      </div>

      {isRecording && (
        <div className="text-2xl font-mono font-bold text-gray-700 mb-4">
          {formatTime(recordingTime)}
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center space-x-2 text-blue-600 mt-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Processing audio...</span>
        </div>
      )}
    </div>
  );
}
