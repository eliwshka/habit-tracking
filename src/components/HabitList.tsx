'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { updateHabit, deleteHabit, completeHabit, archiveHabit } from '@/utils/storage';
import HabitCalendar from './HabitCalendar';

interface HabitListProps {
  habits: Habit[];
  onHabitUpdate: (habit: Habit) => void;
  onHabitDelete: (habitId: string) => void;
}

export default function HabitList({ habits, onHabitUpdate, onHabitDelete }: HabitListProps) {
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'complete' | 'archive';
    habitId: string;
  } | null>(null);

  // Calculate completion percentage
  const getCompletionPercentage = (habit: Habit) => {
    if (!habit.target) return 0;
    return Math.min(100, Math.round((habit.completedDates.length / habit.target) * 100));
  };

  const toggleHabitStatus = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = { ...habit };
    
    if (habit.completedDates.includes(today)) {
      updatedHabit.completedDates = habit.completedDates.filter(date => date !== today);
    } else {
      updatedHabit.completedDates = [...habit.completedDates, today];
    }
    
    // Check if we've reached the target
    if (updatedHabit.target && updatedHabit.completedDates.length >= updatedHabit.target) {
      setConfirmAction({
        type: 'complete',
        habitId: habit.id
      });
    }
    
    updateHabit(updatedHabit);
    onHabitUpdate(updatedHabit);
  };

  const handleToggleDate = (habit: Habit, date: string) => {
    const updatedHabit = { ...habit };
    
    if (habit.completedDates.includes(date)) {
      updatedHabit.completedDates = habit.completedDates.filter(d => d !== date);
    } else {
      updatedHabit.completedDates = [...habit.completedDates, date];
    }
    
    // Check if we've reached the target
    if (updatedHabit.target && updatedHabit.completedDates.length >= updatedHabit.target) {
      setConfirmAction({
        type: 'complete',
        habitId: habit.id
      });
    }
    
    updateHabit(updatedHabit);
    onHabitUpdate(updatedHabit);
  };

  const handleComplete = (habitId: string) => {
    completeHabit(habitId);
    onHabitUpdate({
      ...habits.find(h => h.id === habitId)!,
      isCompleted: true,
      status: 'completed'
    });
    setConfirmAction(null);
  };

  const handleArchive = (habitId: string) => {
    archiveHabit(habitId);
    onHabitUpdate({
      ...habits.find(h => h.id === habitId)!,
      status: 'archived'
    });
    setConfirmAction(null);
  };
  
  const handleDelete = (habitId: string) => {
    setConfirmAction({
      type: 'delete',
      habitId
    });
  };

  const confirmDelete = (habitId: string) => {
    deleteHabit(habitId);
    onHabitDelete(habitId);
    setConfirmAction(null);
  };

  const toggleExpand = (habitId: string) => {
    if (expandedHabit === habitId) {
      setExpandedHabit(null);
    } else {
      setExpandedHabit(habitId);
    }
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-lg">No habits found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {confirmAction.type === 'delete' ? 'Delete Habit?' :
               confirmAction.type === 'complete' ? 'Congratulations!' : 'Archive Habit?'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {confirmAction.type === 'delete' 
                ? 'Are you sure you want to delete this habit? This action cannot be undone.'
                : confirmAction.type === 'complete'
                ? "You've reached your target days! Would you like to mark this habit as completed?"
                : "Would you like to archive this habit? You can access it later in the archived section."}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              {confirmAction.type === 'delete' ? (
                <button
                  onClick={() => confirmDelete(confirmAction.habitId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              ) : confirmAction.type === 'complete' ? (
                <button
                  onClick={() => handleComplete(confirmAction.habitId)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              ) : (
                <button
                  onClick={() => handleArchive(confirmAction.habitId)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {habits.map((habit) => {
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completedDates.includes(today);
        const completionPercentage = getCompletionPercentage(habit);
        const isExpanded = expandedHabit === habit.id;

        return (
          <div
            key={habit.id}
            className={`bg-white dark:bg-gray-800 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${
              habit.isCompleted ? 'border-green-200 dark:border-green-900' :
              habit.status === 'archived' ? 'border-gray-200 dark:border-gray-700 opacity-70' :
              'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {habit.status !== 'completed' && habit.status !== 'archived' && (
                    <button
                      onClick={() => toggleHabitStatus(habit)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                        isCompletedToday
                          ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'
                      }`}
                      aria-label={isCompletedToday ? "Completed today" : "Mark as completed for today"}
                    >
                      {isCompletedToday && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  {habit.status === 'completed' && (
                    <span className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                  {habit.status === 'archived' && (
                    <span className="w-7 h-7 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{habit.title}</h3>
                    {habit.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{habit.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {habit.status === 'active' && (
                    <button
                      onClick={() => setConfirmAction({ type: 'archive', habitId: habit.id })}
                      className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      aria-label="Archive habit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => toggleExpand(habit.id)}
                    className="p-2 text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400"
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    aria-label="Delete habit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {habit.target && habit.status === 'active' && (
                <div className="mt-2 mb-3">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>{habit.completedDates.length} / {habit.target} days</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  habit.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  habit.status === 'active' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {habit.status === 'completed' ? 'Completed' : 
                   habit.status === 'active' ? 'In Progress' : 'Archived'}
                </span>
                {habit.completedDates.length > 0 && (
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-xs font-medium">
                    {habit.completedDates.length} {habit.completedDates.length === 1 ? 'day' : 'days'}
                  </span>
                )}
                {isCompletedToday && habit.status === 'active' && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                    Completed Today
                  </span>
                )}
              </div>
            </div>

            {/* Expandable calendar section */}
            {isExpanded && habit.status !== 'archived' && (
              <div className="px-5 pb-5 pt-2 border-t dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Habit Tracker</h4>
                <HabitCalendar 
                  completedDates={habit.completedDates} 
                  onToggleDate={(date) => handleToggleDate(habit, date)} 
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 