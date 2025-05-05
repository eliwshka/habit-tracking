'use client';

import { useState } from 'react';
import { Habit, HabitFormData } from '@/types/habit';
import { addHabit } from '@/utils/storage';

interface HabitFormProps {
  onHabitAdded: (habit: Habit) => void;
}

export default function HabitForm({ onHabitAdded }: HabitFormProps) {
  const [formData, setFormData] = useState<HabitFormData>({
    title: '',
    description: '',
    target: 21, // Default 21 days for habit formation
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      description: formData.description?.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
      completedDates: [],
      isCompleted: false,
      target: formData.target,
    };

    addHabit(newHabit);
    onHabitAdded(newHabit);
    setFormData({ title: '', description: '', target: 21 });
    setIsOpen(false);
  };

  const predefinedHabits = [
    { title: "Drink water", description: "8 glasses per day", target: 30 },
    { title: "Exercise", description: "30 minutes daily", target: 30 },
    { title: "Read", description: "15 minutes before bed", target: 21 },
    { title: "Meditate", description: "5 minutes in the morning", target: 21 },
  ];

  const selectPredefinedHabit = (habit: { title: string; description: string; target: number }) => {
    setFormData(habit);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Habit
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Habit</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Quick add section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick add:</h3>
            <div className="flex flex-wrap gap-2">
              {predefinedHabits.map((habit) => (
                <button
                  key={habit.title}
                  onClick={() => selectPredefinedHabit(habit)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {habit.title}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Habit Title*
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="e.g., Drink water, Read books, Exercise"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Add some details about your habit..."
                rows={2}
              />
            </div>
            
            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target (days)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="target"
                  min="1"
                  max="100"
                  value={formData.target || 21}
                  onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 min-w-[40px]">
                  {formData.target || 21}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                It typically takes 21-30 days to form a habit. Set your target accordingly.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Add Habit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 