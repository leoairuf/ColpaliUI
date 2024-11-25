import React from 'react';
import { UserCircle, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Bot className="w-6 h-6 text-blue-500" />
        </div>
      )}
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'ml-12' : 'mr-12'}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}>
          <ReactMarkdown
            className="prose max-w-none dark:prose-invert"
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={vscDarkPlus}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
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
        </div>
        <div className={`text-xs mt-1 ${isUser ? 'text-right' : ''} text-gray-500`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <UserCircle className="w-6 h-6 text-blue-500" />
        </div>
      )}
    </div>
  );
}