import { useState, useEffect, useCallback } from "react";
import { weeklyData } from "@/data/weeklyData";

const STORAGE_KEY = "mext-habit-tracker";
const STREAK_KEY = "mext-streak";
const LAST_ACTIVITY_KEY = "mext-last-activity";

interface StoredData {
  completedTasks: Record<number, string[]>;
  currentWeek: number;
}

export const useHabitTracker = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [completedTasks, setCompletedTasks] = useState<Record<number, Set<string>>>({});
  const [streak, setStreak] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        setCurrentWeek(data.currentWeek || 1);
        
        // Convert arrays back to Sets
        const tasksMap: Record<number, Set<string>> = {};
        Object.entries(data.completedTasks || {}).forEach(([week, tasks]) => {
          tasksMap[parseInt(week)] = new Set(tasks as string[]);
        });
        setCompletedTasks(tasksMap);
      } catch (e) {
        console.error("Failed to parse stored data:", e);
      }
    }

    // Calculate streak
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    const storedStreak = parseInt(localStorage.getItem(STREAK_KEY) || "0");
    
    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        setStreak(storedStreak);
      } else {
        setStreak(0);
        localStorage.setItem(STREAK_KEY, "0");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const tasksToStore: Record<number, string[]> = {};
    Object.entries(completedTasks).forEach(([week, tasks]) => {
      tasksToStore[parseInt(week)] = Array.from(tasks);
    });

    const data: StoredData = {
      completedTasks: tasksToStore,
      currentWeek,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [completedTasks, currentWeek]);

  const toggleTask = useCallback((weekNumber: number, taskId: string) => {
    setCompletedTasks(prev => {
      const weekTasks = new Set(prev[weekNumber] || []);
      
      if (weekTasks.has(taskId)) {
        weekTasks.delete(taskId);
      } else {
        weekTasks.add(taskId);
        
        // Update streak
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
        
        if (lastActivity !== today) {
          const currentStreak = parseInt(localStorage.getItem(STREAK_KEY) || "0");
          const newStreak = currentStreak + 1;
          setStreak(newStreak);
          localStorage.setItem(STREAK_KEY, newStreak.toString());
          localStorage.setItem(LAST_ACTIVITY_KEY, today);
        }
      }
      
      return { ...prev, [weekNumber]: weekTasks };
    });
  }, []);

  const getWeekCompletedTasks = useCallback((weekNumber: number) => {
    return completedTasks[weekNumber] || new Set<string>();
  }, [completedTasks]);

  const calculateOverallProgress = useCallback(() => {
    let totalTasks = 0;
    let completedCount = 0;

    weeklyData.forEach(week => {
      const weekTasks = [...week.japanese, ...week.aiml, ...week.college, ...week.goals];
      totalTasks += weekTasks.length;
      const weekCompleted = completedTasks[week.weekNumber] || new Set();
      completedCount += weekTasks.filter(t => weekCompleted.has(t.id)).length;
    });

    return totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  }, [completedTasks]);

  return {
    currentWeek,
    setCurrentWeek,
    toggleTask,
    getWeekCompletedTasks,
    calculateOverallProgress,
    streak,
    totalWeeks: weeklyData.length,
    weekData: weeklyData[currentWeek - 1],
  };
};
