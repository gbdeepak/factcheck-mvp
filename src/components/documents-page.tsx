'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, AlertTriangle, Play, Loader2 } from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  displayName: string;
  type: string;
  size: string;
}

interface DocumentsPageProps {
  onAnalysisComplete: () => void;
}

export function DocumentsPage({ onAnalysisComplete }: DocumentsPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Existing documents from the docs/ folder
  const existingDocuments: DocumentItem[] = [
    {
      id: '1',
      name: 'access_management_policy.md',
      displayName: 'Access Management Policy',
      type: 'Markdown',
      size: '12.5 KB'
    },
    {
      id: '2',
      name: 'antivirus_management_procedure.md',
      displayName: 'Antivirus Management Procedure',
      type: 'Markdown',
      size: '8.2 KB'
    },
    {
      id: '3',
      name: 'data_management_policy.md',
      displayName: 'Data Management Policy',
      type: 'Markdown',
      size: '15.8 KB'
    },
    {
      id: '4',
      name: 'disaster_recovery_plan.md',
      displayName: 'Disaster Recovery Plan',
      type: 'Markdown',
      size: '22.1 KB'
    },
    {
      id: '5',
      name: 'encryption_management.md',
      displayName: 'Encryption Management',
      type: 'Markdown',
      size: '18.7 KB'
    },
    {
      id: '6',
      name: 'information_security_policy.md',
      displayName: 'Information Security Policy',
      type: 'Markdown',
      size: '25.3 KB'
    },
    {
      id: '7',
      name: 'risk_management_assessment_and_treatment_policy.md',
      displayName: 'Risk Management Assessment and Treatment Policy',
      type: 'Markdown',
      size: '19.6 KB'
    },
    {
      id: '8',
      name: 'vendor_management_policy.md',
      displayName: 'Vendor Management Policy',
      type: 'Markdown',
      size: '14.2 KB'
    }
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate 3-second analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      onAnalysisComplete();
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Document Analysis
        </h1>
        <p className="text-gray-600">
          Review uploaded policy documents and analyze them for fact extraction and consistency checking.
        </p>
      </div>

      {/* Documents List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Policy Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {existingDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.displayName}</p>
                    <p className="text-sm text-gray-500">
                      {doc.size} • {doc.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Ready</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {!analysisComplete && !isAnalyzing && (
              <div>
                <p className="text-gray-600 mb-6">
                  Click the button below to analyze the documents and extract facts for consistency checking.
                </p>
                <Button 
                  onClick={handleAnalyze}
                  size="lg"
                  className="px-8"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Analyze Documents
                </Button>
              </div>
            )}

            {isAnalyzing && (
              <div>
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Analyzing Documents...
                </p>
                <p className="text-gray-600">
                  Extracting facts and identifying inconsistencies
                </p>
              </div>
            )}

            {analysisComplete && (
              <div>
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Analysis Complete!
                </p>
                <p className="text-gray-600 mb-4">
                  Documents have been analyzed and facts have been extracted. 
                  You can now proceed to the Consistency Check to review the results.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Ready for Consistency Check
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demo Note */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Demo Mode</h3>
              <p className="text-blue-700 text-sm mt-1">
                This is a prototype demonstration. The documents shown are from the existing docs/ folder. 
                Analysis is simulated and will unlock the Consistency Check feature.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
