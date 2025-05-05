'use client';

interface FilterBarProps {
  currentFilter: 'all' | 'active' | 'completed' | 'archived';
  onFilterChange: (filter: 'all' | 'active' | 'completed' | 'archived') => void;
  counts: {
    all: number;
    active: number;
    completed: number;
    archived: number;
  };
}

export default function FilterBar({ currentFilter, onFilterChange, counts }: FilterBarProps) {
  const filters = [
    { value: 'all', label: 'All Habits', icon: '📋', description: 'View all your habits' },
    { value: 'active', label: 'In Progress', icon: '🔄', description: 'Habits you are currently building' },
    { value: 'completed', label: 'Completed', icon: '✅', description: 'Habits you have successfully built' },
    { value: 'archived', label: 'Archived', icon: '🗄️', description: 'Habits you have archived' },
  ] as const;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              currentFilter === filter.value
                ? 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/50 dark:border-indigo-700 border-2 shadow-md'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
            }`}
          >
            <span className="text-xl mb-2">{filter.icon}</span>
            <span className={`font-medium ${
              currentFilter === filter.value 
                ? 'text-indigo-700 dark:text-indigo-300' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {filter.label}
            </span>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {counts[filter.value]}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-indigo-700 dark:text-indigo-300">
        <p className="font-medium">{filters.find(f => f.value === currentFilter)?.description}</p>
      </div>
    </div>
  );
} 