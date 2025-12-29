import { useState, useEffect, useCallback } from "react";
import { weeklyData, Task, WeekData } from "@/data/weeklyData";

const STORAGE_KEY = "mext-habit-tracker-v2";
const STREAK_KEY = "mext-streak";
const LAST_ACTIVITY_KEY = "mext-last-activity";
const NOTES_KEY = "mext-notes";
const CUSTOM_TASKS_KEY = "mext-custom-tasks";

export interface DailyTasks {
  [taskId: string]: boolean[]; // Array of 7 booleans for each day
}

export interface WeekNotes {
  wentWell: string;
  challenges: string;
  improvements: string;
}

interface StoredData {
  dailyTasks: Record<number, DailyTasks>;
  currentWeek: number;
}

interface NotesData {
  [weekNumber: number]: WeekNotes;
}

interface CustomTasksData {
  [weekNumber: number]: {
    japanese: Task[];
    aiml: Task[];
    college: Task[];
    goals: Task[];
  };
}

export const useHabitTracker = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [dailyTasks, setDailyTasks] = useState<Record<number, DailyTasks>>({});
  const [notes, setNotes] = useState<NotesData>({});
  const [streak, setStreak] = useState(0);
  const [customTasks, setCustomTasks] = useState<CustomTasksData>({});
  const [removedTasks, setRemovedTasks] = useState<Record<number, string[]>>({});

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        setCurrentWeek(data.currentWeek || 1);
        setDailyTasks(data.dailyTasks || {});
      } catch (e) {
        console.error("Failed to parse stored data:", e);
      }
    }

    const storedNotes = localStorage.getItem(NOTES_KEY);
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (e) {
        console.error("Failed to parse notes:", e);
      }
    }

    const storedCustomTasks = localStorage.getItem(CUSTOM_TASKS_KEY);
    if (storedCustomTasks) {
      try {
        const parsed = JSON.parse(storedCustomTasks);
        setCustomTasks(parsed.custom || {});
        setRemovedTasks(parsed.removed || {});
      } catch (e) {
        console.error("Failed to parse notes:", e);
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
    const data: StoredData = {
      dailyTasks,
      currentWeek,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [dailyTasks, currentWeek]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_TASKS_KEY, JSON.stringify({ custom: customTasks, removed: removedTasks }));
  }, [customTasks, removedTasks]);

  const toggleDailyTask = useCallback((weekNumber: number, taskId: string, dayIndex: number) => {
    setDailyTasks(prev => {
      const existingWeekTasks = prev[weekNumber];
      const weekTasks = existingWeekTasks ? { ...existingWeekTasks } : {};
      const taskDays = [...(weekTasks[taskId] || [false, false, false, false, false, false, false])];
      taskDays[dayIndex] = !taskDays[dayIndex];
      weekTasks[taskId] = taskDays;

      // Update streak on checking a task
      if (taskDays[dayIndex]) {
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

  const getWeekDailyTasks = useCallback((weekNumber: number): DailyTasks => {
    return dailyTasks[weekNumber] || {};
  }, [dailyTasks]);

  const getTaskCompletionForWeek = useCallback((weekNumber: number, tasks: Task[]) => {
    const weekDailyTasks = dailyTasks[weekNumber] || {};
    let completed = 0;
    let total = 0;

    tasks.forEach(task => {
      const days = weekDailyTasks[task.id] || [false, false, false, false, false, false, false];
      // Count how many days are checked
      const checkedDays = days.filter(Boolean).length;
      completed += checkedDays;
      total += 7; // Each task has 7 days
    });

    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }, [dailyTasks]);

  const calculateOverallProgress = useCallback(() => {
    let totalTasks = 0;
    let completedCount = 0;

    weeklyData.forEach(week => {
      const weekTasks = [...week.japanese, ...week.aiml, ...week.college, ...week.goals];
      const weekDailyTasks = dailyTasks[week.weekNumber] || {};
      
      weekTasks.forEach(task => {
        const days = weekDailyTasks[task.id] || [false, false, false, false, false, false, false];
        completedCount += days.filter(Boolean).length;
        totalTasks += 7;
      });
    });

    return totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  }, [dailyTasks]);

  const getWeekNotes = useCallback((weekNumber: number): WeekNotes => {
    const weekNotes = notes[weekNumber];
    return weekNotes ? weekNotes : { wentWell: '', challenges: '', improvements: '' };
  }, [notes]);

  const updateWeekNotes = useCallback((weekNumber: number, newNotes: Partial<WeekNotes>) => {
    setNotes(prev => ({
      ...prev,
      [weekNumber]: { ...prev[weekNumber], ...newNotes }
    }));
  }, []);

  const getWeeksCompleted = useCallback(() => {
    let count = 0;
    weeklyData.forEach(week => {
      const weekTasks = [...week.japanese, ...week.aiml, ...week.college, ...week.goals];
      const weekDailyTasks = dailyTasks[week.weekNumber] || {};
      let weekTotal = 0;
      let weekCompleted = 0;
      
      weekTasks.forEach(task => {
        const days = weekDailyTasks[task.id] || [false, false, false, false, false, false, false];
        weekCompleted += days.filter(Boolean).length;
        weekTotal += 7;
      });

      if (weekTotal > 0 && (weekCompleted / weekTotal) >= 0.5) {
        count++;
      }
    });
    return count;
  }, [dailyTasks]);

  const addCustomTask = useCallback((weekNumber: number, category: string, task: Task) => {
    setCustomTasks(prev => {
      const weekCustom = prev[weekNumber] || { japanese: [], aiml: [], college: [], goals: [] };
      const categoryTasks = [...(weekCustom[category as keyof typeof weekCustom] || [])];
      categoryTasks.push(task);
      return {
        ...prev,
        [weekNumber]: {
          ...weekCustom,
          [category]: categoryTasks
        }
      };
    });
  }, []);

  const removeTask = useCallback((weekNumber: number, taskId: string) => {
    setRemovedTasks(prev => {
      const weekRemoved = prev[weekNumber] || [];
      if (weekRemoved.includes(taskId)) return prev;
      return {
        ...prev,
        [weekNumber]: [...weekRemoved, taskId]
      };
    });
  }, []);

  // Get week data with custom tasks and removed tasks applied
  const getProcessedWeekData = useCallback((weekNumber: number): WeekData | undefined => {
    const baseWeek = weeklyData[weekNumber - 1];
    if (!baseWeek) return undefined;

    const weekCustom = customTasks[weekNumber] || { japanese: [], aiml: [], college: [], goals: [] };
    const weekRemoved = removedTasks[weekNumber] || [];

    const filterTasks = (tasks: Task[], customAdditions: Task[]) => {
      const filtered = tasks.filter(t => !weekRemoved.includes(t.id));
      return [...filtered, ...customAdditions];
    };

    return {
      ...baseWeek,
      japanese: filterTasks(baseWeek.japanese, weekCustom.japanese),
      aiml: filterTasks(baseWeek.aiml, weekCustom.aiml),
      college: filterTasks(baseWeek.college, weekCustom.college),
      goals: filterTasks(baseWeek.goals, weekCustom.goals),
    };
  }, [customTasks, removedTasks]);

  const processedWeekData = getProcessedWeekData(currentWeek);

  return {
    currentWeek,
    setCurrentWeek,
    toggleDailyTask,
    getWeekDailyTasks,
    getTaskCompletionForWeek,
    calculateOverallProgress,
    getWeekNotes,
    updateWeekNotes,
    getWeeksCompleted,
    addCustomTask,
    removeTask,
    streak,
    totalWeeks: weeklyData.length,
    weekData: processedWeekData,
    allWeeks: weeklyData,
  };
};
