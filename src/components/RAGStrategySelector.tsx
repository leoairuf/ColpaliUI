import React from 'react';
import { Database, Graph, Image, GitMerge, Settings } from 'lucide-react';
import { RAGConfig, RAGStrategy } from '../types';

const STRATEGY_INFO: Record<RAGStrategy, { icon: React.ElementType; description: string }> = {
  basic: {
    icon: Database,
    description: 'Simple vector similarity search with chunking',
  },
  hybrid: {
    icon: GitMerge,
    description: 'Combines dense and sparse retrieval methods',
  },
  dynamic: {
    icon: Settings,
    description: 'Adaptive retrieval based on query complexity',
  },
  visual: {
    icon: Image,
    description: 'Includes image analysis and visual context',
  },
  graph: {
    icon: Graph,
    description: 'Knowledge graph-based document relationships',
  },
};

interface RAGStrategySelectorProps {
  config: RAGConfig;
  onConfigChange: (config: RAGConfig) => void;
}

export function RAGStrategySelector({ config, onConfigChange }: RAGStrategySelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-96">
      <h2 className="text-lg font-semibold mb-4">RAG Strategy</h2>

      <div className="space-y-4">
        {(Object.keys(STRATEGY_INFO) as RAGStrategy[]).map((strategy) => {
          const { icon: Icon, description } = STRATEGY_INFO[strategy];
          const isSelected = config.strategy === strategy;

          return (
            <button
              key={strategy}
              onClick={() => onConfigChange({ ...config, strategy })}
              className={`w-full flex items-start gap-3 p-3 rounded-lg border ${
                isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } transition-colors`}
            >
              <Icon className={`w-5 h-5 mt-0.5 ${
                isSelected ? 'text-purple-500' : 'text-gray-500'
              }`} />
              <div className="text-left">
                <div className={`font-medium ${
                  isSelected ? 'text-purple-700' : 'text-gray-700'
                }`}>
                  {strategy.charAt(0).toUpperCase() + strategy.slice(1)} RAG
                </div>
                <div className="text-sm text-gray-500">{description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {config.strategy === 'hybrid' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Top K Results
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.topK}
              onChange={(e) => onConfigChange({ ...config, topK: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useHybridSearch"
              checked={config.useHybridSearch}
              onChange={(e) => onConfigChange({ ...config, useHybridSearch: e.target.checked })}
              className="rounded border-gray-300 text-purple-500 focus:ring-purple-500"
            />
            <label htmlFor="useHybridSearch" className="text-sm text-gray-700">
              Enable hybrid search (BM25 + Dense)
            </label>
          </div>
        </div>
      )}
    </div>
  );
}