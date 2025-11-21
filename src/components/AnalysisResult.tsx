import React from "react";
import { CheckCircle, Lightbulb, List, FileText } from "lucide-react";

interface AnalysisData {
    summary: string;
    insights: string[];
    actions: string[];
    description: string;
}

interface AnalysisResultProps {
    data: AnalysisData;
}

export function AnalysisResult({ data }: AnalysisResultProps) {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Summary Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Meeting Summary</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Key Insights */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Lightbulb className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-bold text-gray-900">Key Insights</h2>
                    </div>
                    <ul className="space-y-3">
                        {data.insights.map((insight, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-amber-500 flex-shrink-0" />
                                <span className="text-gray-700">{insight}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-bold text-gray-900">Action Items</h2>
                    </div>
                    <ul className="space-y-3">
                        {data.actions.map((action, index) => (
                            <li key={index} className="flex items-start space-x-2">
                                <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-green-600 flex-shrink-0" />
                                <span className="text-gray-700">{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <List className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Detailed Description</h2>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.description}</p>
            </div>
        </div>
    );
}
