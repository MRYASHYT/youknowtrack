import { useTheme, themes, Theme } from "@/hooks/useTheme";
import { Flame, BarChart3, Target, Link2, Settings, X, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeekData } from "@/data/weeklyData";
import { useState } from "react";

interface SidebarProps {
  weekProgress: number;
  monthProgress: number;
  weeksCompleted: number;
  totalWeeks: number;
  streak: number;
  currentWeek: WeekData;
}

const quickLinks = [
  { name: 'Anki Web', url: 'https://apps.ankiweb.net/' },
  { name: 'Duolingo', url: 'https://www.duolingo.com/' },
  { name: 'Genki Online', url: 'https://genki3.japantimes.co.jp/en/' },
  { name: 'LeetCode', url: 'https://leetcode.com/' },
  { name: 'Kaggle', url: 'https://www.kaggle.com/' },
  { name: 'fast.ai', url: 'https://course.fast.ai/' },
];

const milestones = [
  { week: 10, label: 'Week 10' },
  { week: 24, label: 'Genki I Complete' },
  { week: 32, label: 'JLPT N5' },
  { week: 52, label: 'Year 1 Complete' },
  { week: 104, label: 'JLPT N3' },
  { week: 175, label: 'Depart for Japan!' },
];

export const Sidebar = ({
  weekProgress,
  monthProgress,
  weeksCompleted,
  totalWeeks,
  streak,
  currentWeek,
}: SidebarProps) => {
  const { theme, changeTheme } = useTheme();
  const [showThemes, setShowThemes] = useState(false);

  return (
    <aside className="w-64 flex-shrink-0 space-y-4 hidden lg:block">
      {/* Quick Stats */}
      <div className="glass-card p-4">
        <div className="sidebar-title">
          <BarChart3 className="w-4 h-4" />
          Quick Stats
        </div>
        
        <div className="space-y-3">
          <div className="stat-card">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">This Week</span>
              <span className="text-sm font-semibold">{Math.round(weekProgress)}%</span>
            </div>
            <div className="progress-bar h-1.5">
              <div className="progress-fill bg-primary" style={{ width: `${weekProgress}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">This Month</span>
              <span className="text-sm font-semibold">{Math.round(monthProgress)}%</span>
            </div>
            <div className="progress-bar h-1.5">
              <div className="progress-fill bg-accent" style={{ width: `${monthProgress}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Journey</span>
              <span className="text-sm font-semibold">{weeksCompleted}/{totalWeeks} weeks</span>
            </div>
          </div>

          <div className="stat-card flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Streak</span>
            <div className="flex items-center gap-1">
              <Flame className={cn("w-4 h-4", streak > 0 ? "text-orange-500 fire-emoji" : "text-muted-foreground")} />
              <span className="text-sm font-bold">{streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="glass-card p-4">
        <div className="sidebar-title">
          <Target className="w-4 h-4" />
          Milestones
        </div>
        <div className="space-y-2">
          {milestones.map(m => {
            const isCompleted = currentWeek.weekNumber >= m.week;
            const isCurrent = currentWeek.weekNumber >= m.week - 5 && currentWeek.weekNumber < m.week;
            
            return (
              <div 
                key={m.week} 
                className={cn(
                  "flex items-center gap-2 text-sm py-1",
                  isCompleted ? "text-primary" : isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px]",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-border"
                )}>
                  {isCompleted && "✓"}
                </span>
                <span className={cn(isCompleted && "line-through")}>{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card p-4">
        <div className="sidebar-title">
          <Link2 className="w-4 h-4" />
          Quick Links
        </div>
        <div className="space-y-1">
          {quickLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-link"
            >
              <span>•</span>
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="glass-card p-4">
        <button 
          onClick={() => setShowThemes(!showThemes)}
          className="sidebar-title w-full justify-between cursor-pointer hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Theme
          </div>
          <span className="text-xs">{themes.find(t => t.id === theme)?.emoji}</span>
        </button>
        
        {showThemes && (
          <div className="space-y-1 mt-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                className={cn("theme-btn", theme === t.id && "active")}
              >
                <div 
                  className="theme-dot" 
                  style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }}
                />
                <span className="flex-1 text-left">{t.name}</span>
                <span>{t.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
