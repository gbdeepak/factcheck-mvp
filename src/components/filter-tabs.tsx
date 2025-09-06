'use client';

import { Button } from '@/components/ui/button';
import { FilterType } from '@/types';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    inconsistent: number;
    consistent: number;
  };
}

export function FilterTabs({ activeFilter, onFilterChange, stats }: FilterTabsProps) {
  const tabs = [
    {
      id: 'all' as FilterType,
      label: 'All Facts',
      icon: Calendar,
      count: stats.total
    },
    {
      id: 'inconsistent' as FilterType,
      label: 'Inconsistencies',
      icon: AlertTriangle,
      count: stats.inconsistent
    },
    {
      id: 'consistent' as FilterType,
      label: 'Consistent Facts',
      icon: CheckCircle,
      count: stats.consistent
    }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onFilterChange(tab.id)}
            className={cn(
              "flex-1 justify-start",
              isActive && "bg-white shadow-sm"
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {tab.label}
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              {tab.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
