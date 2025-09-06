'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats, FilterType } from '@/types';
import { Calendar, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  stats: DashboardStats;
  onFilterChange?: (filter: FilterType) => void;
}

export function DashboardStatsComponent({ stats, onFilterChange }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className={`${onFilterChange ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={() => onFilterChange?.('all')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Objective Facts</CardTitle>
          <Calendar className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFacts}</div>
        </CardContent>
      </Card>
      
      <Card 
        className={`${onFilterChange ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={() => onFilterChange?.('inconsistent')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inconsistent Facts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{stats.inconsistentFacts}</div>
          <p className="text-xs text-red-500">↓ -{stats.inconsistentFacts} conflicts</p>
        </CardContent>
      </Card>
      
      <Card 
        className={`${onFilterChange ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        onClick={() => onFilterChange?.('consistent')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consistent Facts</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{stats.consistentFacts}</div>
          <p className="text-xs text-green-500">↑ +{stats.consistentFacts} aligned</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consistency Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.consistencyRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
