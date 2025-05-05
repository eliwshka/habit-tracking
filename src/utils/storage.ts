import { Habit } from '@/types/habit';

const STORAGE_KEY = 'habits';

// Migrate old habit data to new format if needed
const migrateHabits = (habits: any[]): Habit[] => {
  return habits.map(habit => {
    // Check if habit already has isCompleted property
    if (habit.hasOwnProperty('isCompleted')) {
      return habit;
    }

    // Add missing properties
    return {
      ...habit,
      isCompleted: habit.status === 'completed',
      target: habit.target || 21,
      // Convert 'new' status to 'active'
      status: habit.status === 'new' ? 'active' : habit.status,
    };
  });
};

export const getHabits = (): Habit[] => {
  if (typeof window === 'undefined') return [];
  const habitsJson = localStorage.getItem(STORAGE_KEY);
  
  if (!habitsJson) return [];
  
  try {
    const parsedHabits = JSON.parse(habitsJson);
    return migrateHabits(parsedHabits);
  } catch (e) {
    console.error('Error parsing habits from localStorage', e);
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const addHabit = (habit: Habit): void => {
  const habits = getHabits();
  habits.push(habit);
  saveHabits(habits);
};

export const updateHabit = (updatedHabit: Habit): void => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === updatedHabit.id);
  if (index !== -1) {
    habits[index] = updatedHabit;
    saveHabits(habits);
  }
};

export const deleteHabit = (habitId: string): void => {
  const habits = getHabits();
  const filteredHabits = habits.filter(h => h.id !== habitId);
  saveHabits(filteredHabits);
};

export const completeHabit = (habitId: string): void => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === habitId);
  
  if (index !== -1) {
    habits[index] = {
      ...habits[index],
      isCompleted: true,
      status: 'completed'
    };
    saveHabits(habits);
  }
};

export const archiveHabit = (habitId: string): void => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === habitId);
  
  if (index !== -1) {
    habits[index] = {
      ...habits[index],
      status: 'archived'
    };
    saveHabits(habits);
  }
}; 