import React from 'react';
import { Settings2, Sliders, Cpu } from 'lucide-react';
import { ModelConfig, ModelProvider } from '../types';

const MODEL_OPTIONS: Record<ModelProvider, string[]> = {
  openai: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1'],
  ollama: ['llama2', 'mistral', 'mixtral', 'codellama'],
  vllm: ['llama2-70b', 'mixtral-8x7b', 'phi-2'],
  huggingface: ['mistralai/mixtral-8x7b', 'meta-llama/llama-2-70b'],
};

interface ModelConfigPanelProps {
  config: ModelConfig;
  onConfigChange: (config: ModelConfig) => void;
}

export function ModelConfigPanel({ config, onConfigChange }: ModelConfigPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-96">
      <div className="flex items-center gap-2 mb-6">
        <Cpu className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold">Model Configuration</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <select
              value={config.provider}
              onChange={(e) => onConfigChange({ ...config, provider: e.target.value as ModelProvider })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.keys(MODEL_OPTIONS).map((provider) => (
                <option key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <select
              value={config.modelName}
              onChange={(e) => onConfigChange({ ...config, modelName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {MODEL_OPTIONS[config.provider].map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {config.provider !== 'openai' && config.provider !== 'anthropic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint URL
              </label>
              <input
                type="text"
                value={config.endpoint}
                onChange={(e) => onConfigChange({ ...config, endpoint: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="http://localhost:8000"
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Advanced Parameters</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => onConfigChange({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <div className="text-xs text-gray-500 mt-1">{config.temperature}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top P
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.topP}
                onChange={(e) => onConfigChange({ ...config, topP: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <div className="text-xs text-gray-500 mt-1">{config.topP}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="32000"
                value={config.maxTokens}
                onChange={(e) => onConfigChange({ ...config, maxTokens: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency Penalty
              </label>
              <input
                type="number"
                min="-2"
                max="2"
                step="0.1"
                value={config.frequencyPenalty}
                onChange={(e) => onConfigChange({ ...config, frequencyPenalty: parseFloat(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}