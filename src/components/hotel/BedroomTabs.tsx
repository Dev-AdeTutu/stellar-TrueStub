'use client';

import { cn } from '@/lib/utils';
import { BEDROOM_FILTERS } from '@/lib/mockData/hotels';

interface BedroomTabsProps {
  selected: string;
  onSelect: (value: string) => void;
}

export default function BedroomTabs({ selected, onSelect }: BedroomTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {BEDROOM_FILTERS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onSelect(tab.value)}
          className={cn(
            'rounded-[10px] border px-6 py-3 text-sm font-medium transition',
            selected === tab.value
              ? 'border-gray-200 bg-gray-100 text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
