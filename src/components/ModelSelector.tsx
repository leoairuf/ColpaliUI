import React from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { ModelConfig } from '../types';

interface ModelSelectorProps {
  config: ModelConfig;
  onConfigChange: (config: ModelConfig) => void;
}

export function ModelSelector({ config, onConfigChange }: ModelSelectorProps) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <Settings className="w-4 h-4" />
        <span>{config.modelName}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 hidden group-hover:block">
        <h3 className="font-medium mb-3">Model Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <select
              value={config.provider}
              onChange={(e) => onConfigChange({ ...config, provider: e.target.value as ModelConfig['provider'] })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="ollama">Ollama</option>
              <option value="vllm">vLLM</option>
              <option value="huggingface">Hugging Face</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
            <input
              type="text"
              value={config.modelName}
              onChange={(e) => onConfigChange({ ...config, modelName: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g., llama2, mistral-7b"
            />
          </div>

          {config.provider !== 'ollama' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
              <input
                type="text"
                value={config.endpoint}
                onChange={(e) => onConfigChange({ ...config, endpoint: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="http://localhost:8000"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => onConfigChange({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                min="1"
                value={config.maxTokens}
                onChange={(e) => onConfigChange({ ...config, maxTokens: parseInt(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}