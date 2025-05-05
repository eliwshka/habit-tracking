'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { getHabits } from '@/utils/storage';
import HabitList from '@/components/HabitList';
import HabitForm from '@/components/HabitForm';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [darkMode, setDarkMode] = useState(false);

  // Load habits from localStorage
  useEffect(() => {
    setHabits(getHabits());
    
    // Check user's preferred color scheme
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      if (isDarkMode) document.documentElement.classList.add('dark');
    }
  }, []);

  // Update dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Compute counts for each category
  const counts = {
    all: habits.length,
    active: habits.filter(h => h.status === 'active').length,
    completed: habits.filter(h => h.status === 'completed').length,
    archived: habits.filter(h => h.status === 'archived').length,
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    return habit.status === filter;
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Habit Tracker</h1>
            </div>
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form only visible when viewing active habits */}
        {(filter === 'all' || filter === 'active') && (
          <div className="mb-8">
            <HabitForm onHabitAdded={(habit) => setHabits(prev => [...prev, habit])} />
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          {/* Filter Bar */}
          <FilterBar 
            currentFilter={filter} 
            onFilterChange={setFilter} 
            counts={counts}
          />
          
          {/* Motivational section */}
          {filter === 'active' && counts.active > 0 && (
            <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 flex items-start">
              <span className="text-2xl mr-3">💪</span>
              <div>
                <h3 className="font-medium text-indigo-700 dark:text-indigo-300">Keep going strong!</h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  Consistency is key to building lasting habits. You're making great progress!
                </p>
              </div>
            </div>
          )}
          
          {filter === 'completed' && counts.completed > 0 && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-start">
              <span className="text-2xl mr-3">🎉</span>
              <div>
                <h3 className="font-medium text-green-700 dark:text-green-300">Congratulations!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  You've successfully built {counts.completed} habit{counts.completed !== 1 ? 's' : ''}. Amazing work!
                </p>
              </div>
            </div>
          )}
          
          {/* Habit List */}
          <HabitList 
            habits={filteredHabits}
            onHabitUpdate={(updatedHabit) => {
              setHabits(habits.map(h => 
                h.id === updatedHabit.id ? updatedHabit : h
              ));
            }}
            onHabitDelete={(habitId) => {
              setHabits(habits.filter(h => h.id !== habitId));
            }}
          />
        </div>
      </div>
    </main>
  );
}
