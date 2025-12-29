import { useHabitTracker } from "@/hooks/useHabitTracker";
import { WeekHeader } from "@/components/WeekHeader";
import { CategorySection } from "@/components/CategorySection";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { ResourceLinks } from "@/components/ResourceLinks";
import { WeekSelector } from "@/components/WeekSelector";
import { Plane, Sparkles } from "lucide-react";

const Index = () => {
  const {
    currentWeek,
    setCurrentWeek,
    toggleTask,
    getWeekCompletedTasks,
    calculateOverallProgress,
    streak,
    totalWeeks,
    weekData,
  } = useHabitTracker();

  const completedTasks = getWeekCompletedTasks(currentWeek);
  const overallProgress = calculateOverallProgress();

  if (!weekData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Plane className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MEXT Journey Planner
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-muted-foreground">
            Your Complete Roadmap to AI/ML Master's in Japan
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            December 2024 — April 2028 • {totalWeeks} Weeks
          </p>
        </header>

        {/* Week selector */}
        <div className="flex justify-end mb-4">
          <WeekSelector currentWeek={currentWeek} onSelectWeek={setCurrentWeek} />
        </div>

        {/* Week Header */}
        <WeekHeader 
          week={weekData}
          currentWeek={currentWeek}
          totalWeeks={totalWeeks}
          onPreviousWeek={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
          onNextWeek={() => setCurrentWeek(Math.min(totalWeeks, currentWeek + 1))}
          overallProgress={overallProgress}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <CategorySection
              title="Japanese Learning"
              category="japanese"
              tasks={weekData.japanese}
              completedTasks={completedTasks}
              onToggleTask={(taskId) => toggleTask(currentWeek, taskId)}
            />
            
            <CategorySection
              title="AI/ML Work"
              category="aiml"
              tasks={weekData.aiml}
              completedTasks={completedTasks}
              onToggleTask={(taskId) => toggleTask(currentWeek, taskId)}
            />
            
            <CategorySection
              title="College Work"
              category="college"
              tasks={weekData.college}
              completedTasks={completedTasks}
              onToggleTask={(taskId) => toggleTask(currentWeek, taskId)}
            />
            
            <CategorySection
              title="Weekly Goals"
              category="goals"
              tasks={weekData.goals}
              completedTasks={completedTasks}
              onToggleTask={(taskId) => toggleTask(currentWeek, taskId)}
            />
          </div>

          {/* Right column - Dashboard */}
          <div className="space-y-6">
            <ProgressDashboard 
              week={weekData}
              completedTasks={completedTasks}
              streak={streak}
            />
            
            {weekData.resources && (
              <ResourceLinks resources={weekData.resources} />
            )}

            {/* Motivational Quote */}
            <div className="glass-card p-5 text-center">
              <p className="text-sm italic text-muted-foreground mb-2">
                "The journey of a thousand miles begins with a single step."
              </p>
              <p className="text-xs text-muted-foreground">— Lao Tzu</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with dedication for your MEXT scholarship journey</p>
          <p className="mt-1">頑張って! (Ganbatte!) — Good luck!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
