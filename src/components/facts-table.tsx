'use client';

import { FactGroup } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { getDocumentFileName } from '@/lib/documentMapper';

interface FactsTableProps {
  factGroups: FactGroup[];
  onViewDetails: (factGroup: FactGroup) => void;
}

export function FactsTable({ factGroups, onViewDetails }: FactsTableProps) {
  const getStatusInfo = (factGroup: FactGroup) => {
    const isInconsistent = factGroup.facts.length > 1;
    const hasMultipleValues = factGroup.facts.some(fact => 
      factGroup.facts.some(otherFact => 
        otherFact !== fact && otherFact.value !== fact.value
      )
    );

    if (isInconsistent || hasMultipleValues) {
      return {
        status: 'Inconsistent',
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: AlertTriangle,
        iconColor: 'text-red-500'
      };
    }

    return {
      status: 'Consistent',
      color: 'bg-green-50 text-green-700 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    };
  };

  const getPrimaryValue = (factGroup: FactGroup) => {
    if (factGroup.facts.length === 1) {
      return factGroup.facts[0].value;
    }
    
    const uniqueValues = [...new Set(factGroup.facts.map(fact => fact.value))];
    if (uniqueValues.length === 1) {
      return uniqueValues[0];
    }
    
    return `${uniqueValues.length} different values`;
  };

  const getDocumentInfo = (factGroup: FactGroup) => {
    const documentCount = factGroup.facts.length;
    const documentNames = [...new Set(factGroup.facts.map(fact => getDocumentFileName(fact.document_title)))];
    
    if (documentNames.length <= 2) {
      return `${documentCount} doc${documentCount > 1 ? 's' : ''}: ${documentNames.join(', ')}`;
    }
    
    return `${documentCount} docs: ${documentNames[0]}, ${documentNames[1]} +${documentNames.length - 2} more`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value(s)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {factGroups.map((factGroup) => {
              const statusInfo = getStatusInfo(factGroup);
              const StatusIcon = statusInfo.icon;
              
              return (
                <tr 
                  key={factGroup.key}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onViewDetails(factGroup)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {factGroup.facts[0]?.fact_name || factGroup.key}
                        </div>
                        <div className="text-sm text-gray-500">
                          {factGroup.key}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${statusInfo.color} flex items-center w-fit`}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.iconColor}`} />
                      {statusInfo.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {getPrimaryValue(factGroup)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {getDocumentInfo(factGroup)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(factGroup);
                      }}
                      className="flex items-center"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
