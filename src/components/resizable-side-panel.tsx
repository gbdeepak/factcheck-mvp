'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FactGroup, Fact } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, FileText, AlertTriangle, CheckCircle, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { getDocumentUrl, documentExists, getDocumentFileName } from '@/lib/documentMapper';
import DOCXViewer from './docx-viewer';

interface ResizableSidePanelProps {
  factGroup: FactGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDocument: (fact: Fact) => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function ResizableSidePanel({ factGroup, isOpen, onClose }: ResizableSidePanelProps) {
  const [panelWidth, setPanelWidth] = useState(768); // Default width (twice the original)
  const [isResizing, setIsResizing] = useState(false);
  const [showDocxViewer, setShowDocxViewer] = useState(false);
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidePanelWidth');
    if (savedWidth) {
      setPanelWidth(parseInt(savedWidth, 10));
    }
  }, []);

  // Save width to localStorage
  useEffect(() => {
    localStorage.setItem('sidePanelWidth', panelWidth.toString());
  }, [panelWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 400;
    const maxWidth = 1200;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setPanelWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  if (!factGroup) return null;

  const isInconsistent = factGroup.facts.length > 1;
  const hasMultipleValues = factGroup.facts.some(fact => 
    factGroup.facts.some(otherFact => 
      otherFact !== fact && otherFact.value !== fact.value
    )
  );

  const getStatusInfo = () => {
    if (isInconsistent || hasMultipleValues) {
      return {
        status: 'Inconsistent',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        description: 'This fact has conflicting values across different documents.'
      };
    }

    return {
      status: 'Consistent',
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      description: 'This fact has consistent values across all documents.'
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const uniqueValues = [...new Set(factGroup.facts.map(fact => fact.value))];

  const handleOpenDocument = (fact: Fact) => {
    // Show DOCX viewer inline in the side panel
    setSelectedFact(fact);
    setShowDocxViewer(true);
  };

  const handleCloseDocxViewer = () => {
    setShowDocxViewer(false);
    setSelectedFact(null);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Side Panel */}
      <div 
        ref={panelRef}
        className={`fixed right-0 top-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: panelWidth }}
      >
        {/* Resize Handle */}
        <div 
          className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-200 transition-colors"
          onMouseDown={handleMouseDown}
        />
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fact Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Fact Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  {factGroup.facts[0]?.fact_name || factGroup.key}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fact Key</label>
                  <p className="text-sm text-gray-900 font-mono">{factGroup.key}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                  <div className="mt-1">
                    <Badge className={`${statusInfo.color} flex items-center w-fit`}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.iconColor}`} />
                      {statusInfo.status}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">{statusInfo.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values with Source Information */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Values & Sources</h3>
              
              {uniqueValues.map((value, index) => {
                const factsWithThisValue = factGroup.facts.filter(fact => fact.value === value);
                
                return (
                  <CollapsibleSection
                    key={index}
                    title={`Value: ${value}`}
                    defaultOpen={true}
                  >
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        Found in {factsWithThisValue.length} document(s)
                      </div>
                      
                      {factsWithThisValue.map((fact, factIndex) => (
                        <div key={factIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {getDocumentFileName(fact.document_title)}
                              </h4>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDocument(fact)}
                              className="ml-2 flex items-center"
                              disabled={!documentExists(fact.document_title)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {documentExists(fact.document_title) ? 'Open' : 'Not Available'}
                            </Button>
                          </div>
                          
                          {fact.source_sentence && (
                            <div className="mb-3">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source Sentence</label>
                              <p className="text-sm text-gray-700 mt-1 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                                &ldquo;{fact.source_sentence}&rdquo;
                              </p>
                            </div>
                          )}
                          
                          {fact.context && (
                            <div className="mb-3">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Context</label>
                              <p className="text-sm text-gray-600 mt-1">{fact.context}</p>
                            </div>
                          )}
                          
                          {fact.reference && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</label>
                              <p className="text-sm text-gray-600 mt-1">{fact.reference}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DOCX Viewer Modal */}
      {showDocxViewer && selectedFact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {getDocumentFileName(selectedFact.document_title)}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDocxViewer}
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <DOCXViewer
                docxUrl={getDocumentUrl(selectedFact.document_title)}
                targetText={selectedFact.source_sentence}
                onClose={handleCloseDocxViewer}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
