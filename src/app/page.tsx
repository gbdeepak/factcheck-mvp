'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { DashboardStatsComponent } from '@/components/dashboard-stats';
import { StatusFilter } from '@/components/status-filter';
import { FactsTable } from '@/components/facts-table';
import { ResizableSidePanel } from '@/components/resizable-side-panel';
import { DocumentViewer } from '@/components/document-viewer';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FactData, FactGroup, FilterType, Fact, DashboardStats } from '@/types';
import { processFactData, filterFactGroups, searchFactGroups } from '@/lib/data-processor';
import { Search, ClipboardList, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const [factGroups, setFactGroups] = useState<FactGroup[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalFacts: 0,
    inconsistentFacts: 0,
    consistentFacts: 0,
    consistencyRate: 0
  });
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);
  const [selectedFactGroup, setSelectedFactGroup] = useState<FactGroup | null>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFactData();
  }, []);

  const loadFactData = async () => {
    try {
      const response = await fetch('/factIndex.json');
      const data: FactData = await response.json();
      
      const { factGroups: processedGroups, stats: processedStats } = processFactData(data);
      setFactGroups(processedGroups);
      setStats(processedStats);
    } catch (error) {
      console.error('Error loading fact data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCloseDocumentViewer = () => {
    setIsDocumentViewerOpen(false);
    setSelectedFact(null);
  };

  const handleViewFactDetails = (factGroup: FactGroup) => {
    setSelectedFactGroup(factGroup);
    setIsSidePanelOpen(true);
  };

  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setSelectedFactGroup(null);
  };

  // Document opening is now handled in the ResizableSidePanel component

  const filteredFactGroups = searchFactGroups(
    filterFactGroups(factGroups, activeFilter),
    searchTerm
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading policy facts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar activeItem="consistency-check" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Policy Document Inconsistency Analyzer
          </h1>
          <p className="text-gray-600">
            Review facts extracted from policy documents, identify inconsistencies, and analyze policy compliance.
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStatsComponent 
            stats={stats} 
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by fact name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <StatusFilter
              value={activeFilter}
              onChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Content */}
        {activeFilter === 'inconsistent' && filteredFactGroups.length > 0 && (
          <div className="mb-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Policy Inconsistencies Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700">
                  Critical Issues Found: The following policy fields have conflicting values across different documents. 
                  This may lead to confusion, compliance issues, or operational problems.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Facts Table */}
        <div>
          {filteredFactGroups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No facts found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No facts match your search for "${searchTerm}"`
                    : `No ${activeFilter === 'all' ? '' : activeFilter} facts available`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <FactsTable
              factGroups={filteredFactGroups}
              onViewDetails={handleViewFactDetails}
            />
          )}
        </div>

        </div>
      </div>

      {/* Resizable Side Panel */}
      <ResizableSidePanel
        factGroup={selectedFactGroup}
        isOpen={isSidePanelOpen}
        onClose={handleCloseSidePanel}
        onOpenDocument={() => {}} // Not used anymore, handled internally
      />

      {/* Document Viewer Modal */}
      <DocumentViewer
        fact={selectedFact}
        isOpen={isDocumentViewerOpen}
        onClose={handleCloseDocumentViewer}
      />
    </div>
  );
}