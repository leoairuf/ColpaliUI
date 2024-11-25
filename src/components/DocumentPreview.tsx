import React from 'react';
import { ChevronRight, ExternalLink, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface Document {
  id: string;
  pageNumber: number;
  imageUrl: string;
  score: number;
  pdfUrl: string;
}

interface DocumentPreviewProps {
  documents: Document[];
  show: boolean;
  onToggle: () => void;
}

export function DocumentPreview({ documents, show, onToggle }: DocumentPreviewProps) {
  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-[400px] bg-white border-l border-gray-200 transition-transform duration-300 ease-in-out transform",
        show ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Retrieved Documents</h2>
        <div className="flex gap-2">
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {show ? <X className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative group">
              <img
                src={doc.imageUrl}
                alt={`Page ${doc.pageNumber}`}
                className="w-full h-auto"
              />
              <a
                href={`${doc.pdfUrl}#page=${doc.pageNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-6 h-6 text-white" />
              </a>
            </div>
            <div className="p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Page {doc.pageNumber}</span>
                <span className="text-xs text-gray-500">
                  Score: {(doc.score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}