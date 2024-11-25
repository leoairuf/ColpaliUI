import React from 'react';
import { Circle, CheckCircle2, XCircle } from 'lucide-react';
import { AgentStep } from '../types';

interface AgentProgressProps {
  steps: AgentStep[];
}

export function AgentProgress({ steps }: AgentProgressProps) {
  if (steps.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-2xl w-full mx-4 z-50">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Agent Pipeline Progress</h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            {step.status === 'running' && <Circle className="w-4 h-4 text-blue-500 animate-pulse" />}
            {step.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {step.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{step.agentName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{step.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}