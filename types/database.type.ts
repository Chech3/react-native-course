import { Models } from "react-native-appwrite";

export interface Habit extends Models.Document {
  title: string;
  description: string;
  user_id: string;
  frequency: "daily" | "weekly" | "monthly";
  streak_count: number;
  last_completed: string; 
  created_at: string;
}

export interface HabitCompletion extends Models.Document {
  habit_id: string,
  user_id: string,
  completed_at:string;
}


export interface StreakData {
    streak: number;
    bestStreak: number;
    total: number;
  }