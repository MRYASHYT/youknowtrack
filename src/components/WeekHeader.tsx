import { WeekData } from "@/data/weeklyData";
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface WeekHeaderProps {
  week: WeekData;
  currentWeek: number;
  totalWeeks: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  overallProgress: number;
}

export const WeekHeader = ({ 
  week, 
  currentWeek, 
  totalWeeks, 
  onPreviousWeek, 
  onNextWeek,
  overallProgress
}: WeekHeaderProps) => {
  const phaseColors: Record<string, string> = {
    "Foundations": "from-emerald-500 to-teal-500",
    "Core Building": "from-blue-500 to-indigo-500",
    "Advanced Building": "from-purple-500 to-pink-500",
    "Applications": "from-orange-500 to-red-500",
    "Final Preparation": "from-yellow-500 to-orange-500",
  };

  return (
    <div className="glass-card p-6 mb-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onPreviousWeek}
          disabled={currentWeek === 1}
          className="week-nav-btn flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {week.startDate} - {week.endDate}, {week.year}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Week {week.weekNumber}
          </h1>
        </div>
        
        <button 
          onClick={onNextWeek}
          disabled={currentWeek === totalWeeks}
          className="week-nav-btn flex items-center gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Phase and Focus */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        <span className={`phase-badge bg-gradient-to-r ${phaseColors[week.phase] || phaseColors["Foundations"]}`}>
          {week.phase}
        </span>
        <span className="text-sm text-muted-foreground">•</span>
        <span className="text-sm font-medium text-foreground">{week.focus}</span>
      </div>

      {/* Milestone */}
      {week.milestone && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold text-yellow-200">{week.milestone}</span>
        </div>
      )}
      
      {/* Overall journey progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Journey Progress</span>
          <span className="font-medium text-primary">{overallProgress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-fill bg-gradient-to-r from-primary to-purple-400 glow-pulse" 
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Dec 2024</span>
          <span>Week {currentWeek} of {totalWeeks}</span>
          <span>Apr 2028</span>
        </div>
      </div>
    </div>
  );
};
