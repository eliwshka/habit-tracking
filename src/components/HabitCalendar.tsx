'use client';

import { useState, useEffect } from 'react';

interface HabitCalendarProps {
  completedDates: string[];
  onToggleDate: (date: string) => void;
}

export default function HabitCalendar({ completedDates, onToggleDate }: HabitCalendarProps) {
  // Get the last 7 days including today
  const [calendarDays, setCalendarDays] = useState<{ date: string; day: string }[]>([]);
  
  useEffect(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      days.push({ date: dateString, day: dayName });
    }
    
    setCalendarDays(days);
  }, []);
  
  return (
    <div className="flex space-x-1 md:space-x-2 mt-3">
      {calendarDays.map((day) => {
        const isCompleted = completedDates.includes(day.date);
        const isToday = day.date === new Date().toISOString().split('T')[0];
        
        return (
          <button
            key={day.date}
            onClick={() => onToggleDate(day.date)}
            className={`flex flex-col items-center py-1 px-2 rounded-md transition-all duration-200 ${
              isToday ? 'border border-indigo-400 dark:border-indigo-500' : ''
            }`}
          >
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {day.day}
            </span>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 text-sm font-medium ${
                isCompleted 
                  ? 'bg-green-500 text-white dark:bg-green-600' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {new Date(day.date).getDate()}
            </div>
          </button>
        );
      })}
    </div>
  );
} 