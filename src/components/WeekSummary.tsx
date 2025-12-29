import { WeekData, Task } from "@/data/weeklyData";
import { DailyTasks } from "@/hooks/useHabitTracker";
import { BarChart3, CheckCircle2, Flame, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface WeekSummaryProps {
  week: WeekData;
  dailyTasks: DailyTasks;
  streak: number;
  onDownloadPDF: () => void;
}

const getCompletionStats = (tasks: Task[], dailyTasks: DailyTasks) => {
  let completed = 0;
  let total = 0;
  tasks.forEach(task => {
    const days = dailyTasks[task.id] || [false, false, false, false, false, false, false];
    completed += days.filter(Boolean).length;
    total += 7;
  });
  return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
};

export const WeekSummary = ({ week, dailyTasks, streak, onDownloadPDF }: WeekSummaryProps) => {
  const japanese = getCompletionStats(week.japanese, dailyTasks);
  const aiml = getCompletionStats(week.aiml, dailyTasks);
  const college = getCompletionStats(week.college, dailyTasks);
  const goals = getCompletionStats(week.goals, dailyTasks);
  
  const overallCompleted = japanese.completed + aiml.completed + college.completed + goals.completed;
  const overallTotal = japanese.total + aiml.total + college.total + goals.total;
  const overallPercentage = overallTotal > 0 ? (overallCompleted / overallTotal) * 100 : 0;

  const categories = [
    { name: 'Japanese', stats: japanese, color: 'bg-japanese' },
    { name: 'AI/ML', stats: aiml, color: 'bg-aiml' },
    { name: 'College', stats: college, color: 'bg-college' },
    { name: 'Goals', stats: goals, color: 'bg-goals' },
  ];

  return (
    <div className="glass-card p-5 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Week Summary</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Completion</span>
          <span className="text-lg font-bold">{Math.round(overallPercentage)}%</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-fill bg-gradient-to-r from-primary to-accent" style={{ width: `${overallPercentage}%` }} />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center gap-3">
            <span className="text-sm w-20">{cat.name}</span>
            <div className="flex-1 progress-bar h-2">
              <div className={cn("progress-fill", cat.color)} style={{ width: `${cat.stats.percentage}%` }} />
            </div>
            <span className="text-xs text-muted-foreground w-20 text-right">{cat.stats.completed}/{cat.stats.total}</span>
          </div>
        ))}
      </div>

      <div className="stat-card flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className={cn("w-5 h-5", streak > 0 ? "text-orange-500 fire-emoji" : "text-muted-foreground")} />
          <span className="text-sm">Streak</span>
        </div>
        <span className="font-bold">{streak} days</span>
      </div>

      <Button onClick={onDownloadPDF} variant="outline" className="w-full gap-2">
        <Download className="w-4 h-4" />
        Download Week PDF
      </Button>
    </div>
  );
};
