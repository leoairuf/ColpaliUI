import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search, Loader2, X } from 'lucide-react';
import { MockWebSocketService } from './services/mockWebSocket';
import { ChatMessage } from './components/ChatMessage';
import { DocumentPreview } from './components/DocumentPreview';
import { cn } from './lib/utils';

// Use MockWebSocketService for testing
const ws = new MockWebSocketService('ws://localhost:50000');

// Rest of the App.tsx remains exactly the same
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface Document {
  id: string;
  pageNumber: number;
  imageUrl: string;
  score: number;
  pdfUrl: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hello! I'm your AI assistant. You can ask me questions about your documents or upload a PDF to analyze.",
    role: 'assistant',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showDocuments, setShowDocuments] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ws.connect();

    ws.on('message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.content,
        role: 'assistant',
        timestamp: new Date()
      }]);
      setIsLoading(false);
    });

    ws.on('documents', (docs) => {
      setDocuments(docs);
    });

    ws.on('upload_complete', () => {
      setIsUploading(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Documents uploaded successfully',
        role: 'system',
        timestamp: new Date()
      }]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    ws.send('query', { text: input });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    ws.uploadFiles(Array.from(files));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={cn(
        "flex-1 flex flex-col",
        showDocuments && documents.length > 0 && "mr-[400px]"
      )}>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message ChatBot..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {documents.length > 0 && (
        <DocumentPreview
          documents={documents}
          show={showDocuments}
          onToggle={() => setShowDocuments(!showDocuments)}
        />
      )}
    </div>
  );
}

export default App;