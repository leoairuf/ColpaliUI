import React from 'react';
import { Timer, Zap, Brain, Target } from 'lucide-react';
import { PerformanceMetrics as Metrics } from '../types';

interface PerformanceMetricsProps {
  metrics: Metrics;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const formatTime = (ms: number) => {
    return ms < 1000 ? `${ms.toFixed(0)}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Retrieval Time</div>
            <div className="font-medium">{formatTime(metrics.retrievalTime)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-500">Processing Time</div>
            <div className="font-medium">{formatTime(metrics.processingTime)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Tokens Used</div>
            <div className="font-medium">{metrics.tokensUsed.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-500" />
          <div>
            <div className="text-xs text-gray-500">Relevance Score</div>
            <div className="font-medium">{(metrics.relevanceScore * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}