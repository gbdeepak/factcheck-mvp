'use client';

import { FactGroup, Fact } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, FileText, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface SidePanelProps {
  factGroup: FactGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDocument: (fact: Fact) => void;
}

export function SidePanel({ factGroup, isOpen, onClose, onOpenDocument }: SidePanelProps) {
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
  const documentNames = [...new Set(factGroup.facts.map(fact => fact.document_title))];

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
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
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

            {/* Values */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {uniqueValues.map((value, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Found in {factGroup.facts.filter(fact => fact.value === value).length} document(s)
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Source Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {factGroup.facts.map((fact, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {fact.document_title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Value: {fact.value}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenDocument(fact)}
                          className="ml-2 flex items-center"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </div>
                      
                      {fact.source_sentence && (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source Sentence</label>
                          <p className="text-sm text-gray-700 mt-1 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                            "{fact.source_sentence}"
                          </p>
                        </div>
                      )}
                      
                      {fact.context && (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Context</label>
                          <p className="text-sm text-gray-600 mt-1">{fact.context}</p>
                        </div>
                      )}
                      
                      {fact.reference && (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</label>
                          <p className="text-sm text-gray-600 mt-1">{fact.reference}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
