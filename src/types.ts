export type ModelProvider = 'openai' | 'anthropic' | 'ollama' | 'vllm' | 'huggingface';
export type RAGStrategy = 'basic' | 'hybrid' | 'dynamic' | 'visual' | 'graph';

export interface ModelConfig {
  provider: ModelProvider;
  modelName: string;
  endpoint?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface RAGConfig {
  strategy: RAGStrategy;
  chunkSize?: number;
  overlap?: number;
  topK?: number;
  reranker?: string;
  useHybridSearch?: boolean;
  visualAnalysis?: boolean;
  graphAnalysis?: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'agent' | 'system';
  agentName?: string;
  agentAction?: string;
  timestamp: Date;
  status?: 'thinking' | 'complete' | 'error';
  metadata?: {
    citations?: Citation[];
    codeBlocks?: CodeBlock[];
    metrics?: PerformanceMetrics;
    confidence?: number;
  };
}

export interface Citation {
  text: string;
  pageNumber: number;
  pdfUrl: string;
  confidence: number;
}

export interface CodeBlock {
  language: string;
  code: string;
  explanation?: string;
}

export interface PerformanceMetrics {
  retrievalTime: number;
  processingTime: number;
  tokensUsed: number;
  relevanceScore: number;
}

export interface AgentStep {
  id: string;
  agentName: string;
  action: string;
  status: 'running' | 'complete' | 'error';
  timestamp: Date;
  duration?: number;
  metrics?: {
    confidence: number;
    latency: number;
    tokensUsed: number;
  };
}

export interface PDFPreview {
  pageNumber: number;
  imageUrl: string;
  relevance: number;
  pdfUrl: string;
  highlights?: {
    boundingBox: [number, number, number, number];
    text: string;
    confidence: number;
  }[];
}