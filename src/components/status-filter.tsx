'use client';

import { ChevronDown } from 'lucide-react';
import { FilterType } from '@/types';

interface StatusFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

const filterOptions = [
  { value: 'all' as FilterType, label: 'All' },
  { value: 'consistent' as FilterType, label: 'Consistent' },
  { value: 'inconsistent' as FilterType, label: 'Inconsistent' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const selectedOption = filterOptions.find(option => option.value === value);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FilterType)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
