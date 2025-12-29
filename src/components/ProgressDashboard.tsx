import { WeekData } from "@/data/weeklyData";
import { TrendingUp, BookOpen, Brain, GraduationCap, Target, Flame } from "lucide-react";

interface ProgressDashboardProps {
  week: WeekData;
  completedTasks: Set<string>;
  streak: number;
}

export const ProgressDashboard = ({ week, completedTasks, streak }: ProgressDashboardProps) => {
  const allTasks = [...week.japanese, ...week.aiml, ...week.college, ...week.goals];
  const totalTasks = allTasks.length;
  const completedCount = allTasks.filter(t => completedTasks.has(t.id)).length;
  const weekProgress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const categoryStats = [
    { 
      name: 'Japanese', 
      tasks: week.japanese, 
      icon: BookOpen, 
      color: 'text-japanese',
      bg: 'bg-japanese/20',
      fill: 'bg-japanese'
    },
    { 
      name: 'AI/ML', 
      tasks: week.aiml, 
      icon: Brain, 
      color: 'text-aiml',
      bg: 'bg-aiml/20',
      fill: 'bg-aiml'
    },
    { 
      name: 'College', 
      tasks: week.college, 
      icon: GraduationCap, 
      color: 'text-college',
      bg: 'bg-college/20',
      fill: 'bg-college'
    },
    { 
      name: 'Goals', 
      tasks: week.goals, 
      icon: Target, 
      color: 'text-goals',
      bg: 'bg-goals/20',
      fill: 'bg-goals'
    },
  ];

  return (
    <div className="glass-card p-5 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Week Overview</h3>
      </div>

      {/* Weekly progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-3xl font-bold text-foreground">{completedCount}</span>
            <span className="text-muted-foreground">/{totalTasks}</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {weekProgress.toFixed(0)}%
          </span>
        </div>
        <div className="progress-bar h-4">
          <div 
            className="progress-fill bg-gradient-to-r from-primary to-purple-400" 
            style={{ width: `${weekProgress}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="text-sm font-medium text-orange-200">
            {streak} day streak! Keep it up!
          </span>
        </div>
      )}

      {/* Category breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {categoryStats.map(({ name, tasks, icon: Icon, color, bg, fill }) => {
          if (tasks.length === 0) return null;
          const completed = tasks.filter(t => completedTasks.has(t.id)).length;
          const percent = (completed / tasks.length) * 100;
          
          return (
            <div key={name} className={`p-3 rounded-lg ${bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs font-medium text-muted-foreground">{name}</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {completed}/{tasks.length}
              </div>
              <div className="progress-bar h-1.5 mt-2">
                <div className={`progress-fill ${fill}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
