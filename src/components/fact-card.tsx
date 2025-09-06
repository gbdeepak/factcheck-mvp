'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Fact, FactGroup } from '@/types';
import { ChevronDown, ChevronRight, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FactCardProps {
  factGroup: FactGroup;
  onViewDocument: (fact: Fact) => void;
}

export function FactCard({ factGroup, onViewDocument }: FactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { facts, isInconsistent, factName } = factGroup;

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
            <div className="flex items-center space-x-2">
              <span className={cn(
                "text-lg",
                isInconsistent ? "text-yellow-600" : "text-green-600"
              )}>
                {isInconsistent ? "⚠️" : "✅"}
              </span>
              <h3 className="text-lg font-semibold">
                {factName} ({facts.length} fact{facts.length !== 1 ? 's' : ''})
              </h3>
            </div>
          </div>
          <Badge variant={isInconsistent ? "warning" : "success"}>
            {isInconsistent ? "Inconsistent" : "Consistent"}
          </Badge>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {facts.map((fact, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Policy Field:</span>
                      <p className="text-sm text-gray-800">{fact.fact_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <Badge 
                        variant={isInconsistent ? "warning" : "success"}
                        className="ml-2"
                      >
                        {isInconsistent ? "Inconsistent" : "Consistent"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Value:</span>
                      <p className="text-sm font-semibold text-gray-800">{fact.value}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Document:</span>
                      <p className="text-sm text-gray-800">{fact.document_title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Ref:</span>
                      <p className="text-sm text-gray-800">{fact.reference}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDocument(fact)}
                      className="w-full"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {fact.source_sentence.substring(0, 30)}...
                    </Button>
                  </div>
                </div>
                
                {fact.context && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm font-medium text-gray-600">Context:</span>
                    <p className="text-sm text-gray-700 mt-1">{fact.context}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
