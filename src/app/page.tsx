"use client";

import React, { useState } from "react";
import { AudioRecorder } from "../components/AudioRecorder";
import { AnalysisResult } from "../components/AnalysisResult";
import { Sparkles } from "lucide-react";

export default function Home() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAudioCaptured = async (audioBlob: Blob) => {
        setIsProcessing(true);
        setResult(null);

        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
            const response = await fetch("/api/process-audio", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process audio");
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing the audio.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <Sparkles className="w-10 h-10 text-blue-600" />
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            AI Note Taker
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Record your meetings and let AI generate summaries, insights, and action items instantly.
                    </p>
                </div>

                <div className="space-y-12">
                    <AudioRecorder onAudioCaptured={handleAudioCaptured} isProcessing={isProcessing} />

                    {result && <AnalysisResult data={result} />}
                </div>
            </div>
        </main>
    );
}
