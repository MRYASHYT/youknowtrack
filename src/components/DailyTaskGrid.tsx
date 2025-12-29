import { Task, WeekData } from "@/data/weeklyData";
import { DailyTasks } from "@/hooks/useHabitTracker";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyTaskGridProps {
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  category: 'japanese' | 'aiml' | 'college' | 'goals';
  dailyTasks: DailyTasks;
  onToggle: (taskId: string, dayIndex: number) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const categoryColors = {
  japanese: {
    bg: 'bg-japanese/10',
    border: 'border-japanese/30',
    dot: 'bg-japanese',
    progress: 'bg-japanese',
    icon: 'text-japanese',
  },
  aiml: {
    bg: 'bg-aiml/10',
    border: 'border-aiml/30',
    dot: 'bg-aiml',
    progress: 'bg-aiml',
    icon: 'text-aiml',
  },
  college: {
    bg: 'bg-college/10',
    border: 'border-college/30',
    dot: 'bg-college',
    progress: 'bg-college',
    icon: 'text-college',
  },
  goals: {
    bg: 'bg-goals/10',
    border: 'border-goals/30',
    dot: 'bg-goals',
    progress: 'bg-goals',
    icon: 'text-goals',
  },
};

export const DailyTaskGrid = ({
  title,
  icon,
  tasks,
  category,
  dailyTasks,
  onToggle,
}: DailyTaskGridProps) => {
  const colors = categoryColors[category];
  
  // Calculate progress
  let completed = 0;
  let total = 0;
  tasks.forEach(task => {
    const days = dailyTasks[task.id] || [false, false, false, false, false, false, false];
    completed += days.filter(Boolean).length;
    total += 7;
  });
  const progress = total > 0 ? (completed / total) * 100 : 0;

  if (tasks.length === 0) return null;

  return (
    <div className={cn("glass-card p-5", colors.bg, colors.border, "border fade-in")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", colors.dot)} />
          <span className={colors.icon}>{icon}</span>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {completed}/{total} • {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div className={cn("progress-fill", colors.progress)} style={{ width: `${progress}%` }} />
      </div>

      {/* Day headers */}
      <div className="daily-grid mb-2">
        <div></div>
        {DAYS.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-1">
        {tasks.map(task => {
          const taskDays = dailyTasks[task.id] || [false, false, false, false, false, false, false];
          
          return (
            <div key={task.id} className="daily-grid items-center py-1.5">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="task-text truncate">{task.text}</span>
                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-primary hover:text-primary/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {DAYS.map((_, dayIndex) => (
                <button
                  key={dayIndex}
                  onClick={() => onToggle(task.id, dayIndex)}
                  className={cn(
                    "day-checkbox",
                    taskDays[dayIndex] && "checked animate-check"
                  )}
                >
                  {taskDays[dayIndex] && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Schedule hint */}
      {tasks.some(t => t.schedule) && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {tasks.filter(t => t.schedule).slice(0, 2).map(t => `${t.text.split(' ')[0]}: ${t.schedule}`).join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
};
