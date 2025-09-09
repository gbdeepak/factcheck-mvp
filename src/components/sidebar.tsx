'use client';

import { FileText, Upload } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  analysisComplete?: boolean;
}

export function Sidebar({ activeItem = 'documents', onItemClick, analysisComplete = false }: SidebarProps) {
  const navigationItems = [
    {
      id: 'documents',
      label: 'Documents',
      icon: Upload,
    },
    {
      id: 'consistency-check',
      label: 'Consistency Check',
      icon: FileText,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Trenta</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const isDisabled = item.id === 'consistency-check' && !analysisComplete;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => !isDisabled && onItemClick?.(item.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDisabled
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
