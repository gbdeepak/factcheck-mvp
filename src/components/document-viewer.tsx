'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fact } from '@/types';
import { X, FileText, Search, ExternalLink } from 'lucide-react';
import DOCXViewer from './docx-viewer';
import { getDocumentUrl, documentExists, getDocumentFileName } from '@/lib/documentMapper';

interface DocumentViewerProps {
  fact: Fact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ fact, isOpen, onClose }: DocumentViewerProps) {
  const [documentContent, setDocumentContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showDocxViewer, setShowDocxViewer] = useState(false);

  const loadDocument = useCallback(async (documentTitle: string) => {
    setLoading(true);
    try {
      // In a real app, you'd fetch the actual document content
      // For now, we'll simulate with the source sentence and context
      const mockContent = `
# ${documentTitle}

## Overview
This document contains policy information related to the extracted fact.

## Source Information
**Fact:** ${fact?.fact_name}
**Value:** ${fact?.value}
**Context:** ${fact?.context}

## Full Document Content
This is a placeholder for the full document content. In a real implementation, this would load the actual markdown file content from the docs/ directory.

The source sentence is: &ldquo;${fact?.source_sentence}&rdquo;

## Reference
${fact?.reference}

## Additional Context
This section would contain the full document content with proper formatting and structure.
      `;
      setDocumentContent(mockContent);
    } catch (error) {
      console.error('Error loading document:', error);
      setDocumentContent('Error loading document content.');
    } finally {
      setLoading(false);
    }
  }, [fact]);

  useEffect(() => {
    if (fact && isOpen) {
      loadDocument(fact.document_title);
    }
  }, [fact, isOpen]);

  const handleOpenDocx = () => {
    setShowDocxViewer(true);
  };

  const handleCloseDocxViewer = () => {
    setShowDocxViewer(false);
  };

  if (!isOpen || !fact) return null;

  // If DOCX viewer is open, show it instead
  if (showDocxViewer) {
    const docxUrl = getDocumentUrl(fact.document_title);
    return (
      <DOCXViewer
        docxUrl={docxUrl}
        targetText={fact.source_sentence}
        onClose={handleCloseDocxViewer}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <CardTitle className="text-lg">Document Viewer</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {/* Fact Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Fact Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Fact Name:</span>
                  <p className="text-gray-700">{fact.fact_name}</p>
                </div>
                <div>
                  <span className="font-medium">Value:</span>
                  <p className="text-gray-700 font-semibold">{fact.value}</p>
                </div>
                <div>
                  <span className="font-medium">Document:</span>
                  <p className="text-gray-700">{fact.document_title}</p>
                </div>
                <div>
                  <span className="font-medium">Reference:</span>
                  <p className="text-gray-700">{fact.reference}</p>
                </div>
              </div>
            </div>

            {/* Highlighted Source */}
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Source Sentence
              </h3>
              <p className="text-yellow-800 bg-yellow-100 p-3 rounded border">
                &ldquo;{fact.source_sentence}&rdquo;
              </p>
            </div>

            {/* Open Source Document */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Open Source Document
              </h3>
              <p className="text-blue-800 mb-3">
                Click below to open the original document and highlight this specific sentence.
              </p>
              <Button
                onClick={handleOpenDocx}
                className="w-full"
                disabled={!documentExists(fact.document_title)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {documentExists(fact.document_title) 
                  ? `Open ${getDocumentFileName(fact.document_title)}`
                  : 'Document not available'
                }
              </Button>
              {!documentExists(fact.document_title) && (
                <p className="text-sm text-red-600 mt-2">
                  The corresponding .docx file could not be found in the docs/ directory.
                </p>
              )}
            </div>

            {/* Document Content */}
            <div className="prose max-w-none">
              <h3 className="font-semibold mb-2">Document Content</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading document...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded border">
                  {documentContent}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Document
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
