import React from 'react';
import { FileText, X, ExternalLink, Search } from 'lucide-react';
import { PDFPreview } from '../types';

interface PDFPreviewPanelProps {
  previews: PDFPreview[];
  onClose: () => void;
}

export function PDFPreviewPanel({ previews, onClose }: PDFPreviewPanelProps) {
  return (
    <div className="w-96 bg-white border-l border-gray-200 p-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-semibold">PDF Preview</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {previews.map((preview) => (
          <div
            key={preview.pageNumber}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative group">
              <img
                src={preview.imageUrl}
                alt={`Page ${preview.pageNumber}`}
                className="w-full h-auto"
              />
              <a
                href={`${preview.pdfUrl}#page=${preview.pageNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-6 h-6 text-white" />
              </a>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Page {preview.pageNumber}</span>
                <span className="text-xs text-gray-500">
                  Relevance: {(preview.relevance * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}