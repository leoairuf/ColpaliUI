import React from 'react';
import { UserCircle, Bot, Loader2, Link, Code, BarChart } from 'lucide-react';
import { Message, Citation } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface EnhancedMessageProps {
  message: Message;
}

export function EnhancedMessage({ message }: EnhancedMessageProps) {
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';

  const renderCitation = (citation: Citation) => (
    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
      <Link className="w-4 h-4" />
      <a
        href={`${citation.pdfUrl}#page=${citation.pageNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-purple-600 underline"
      >
        Page {citation.pageNumber} ({(citation.confidence * 100).toFixed(1)}% confidence)
      </a>
    </div>
  );

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <UserCircle className="w-8 h-8 text-blue-500" />
          ) : isAgent ? (
            <div className="relative">
              <Bot className="w-8 h-8 text-green-500" />
              {message.status === 'thinking' && (
                <Loader2 className="w-4 h-4 absolute -top-1 -right-1 text-green-500 animate-spin" />
              )}
            </div>
          ) : (
            <Bot className="w-8 h-8 text-purple-500" />
          )}
        </div>

        <div
          className={`rounded-lg p-4 ${
            isUser
              ? 'bg-blue-500 text-white'
              : isAgent
              ? 'bg-green-50 text-gray-800 border border-green-200'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isAgent && message.agentName && (
            <div className="text-sm font-medium text-green-600 mb-1">
              {message.agentName}
            </div>
          )}

          <ReactMarkdown
            className="prose max-w-none dark:prose-invert"
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group">
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigator.clipboard.writeText(String(children))}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <Code className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={match[1]}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0 }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.metadata?.citations && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {message.metadata.citations.map((citation, index) => (
                <div key={index}>{renderCitation(citation)}</div>
              ))}
            </div>
          )}

          {message.metadata?.metrics && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart className="w-4 h-4" />
                <span>
                  Retrieved in {message.metadata.metrics.retrievalTime}ms with{' '}
                  {message.metadata.metrics.tokensUsed} tokens
                </span>
              </div>
            </div>
          )}

          <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}