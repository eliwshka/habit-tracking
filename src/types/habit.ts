export type HabitStatus = 'active' | 'completed' | 'archived';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  status: HabitStatus;
  createdAt: string;
  completedDates: string[]; // ISO date strings
  isCompleted: boolean; // Whether the habit is fully completed
  target?: number; // Optional target number of days
}

export interface HabitFormData {
  title: string;
  description?: string;
  target?: number;
} 