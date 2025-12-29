import { useHabitTracker } from "@/hooks/useHabitTracker";
import { useTheme } from "@/hooks/useTheme";
import { WeekHeader } from "@/components/WeekHeader";
import { DailyTaskGrid } from "@/components/DailyTaskGrid";
import { Sidebar } from "@/components/Sidebar";
import { Notes } from "@/components/Notes";
import { WeekSummary } from "@/components/WeekSummary";
import { WeekSelector } from "@/components/WeekSelector";
import { Chatbot } from "@/components/Chatbot";
import { Plane, Sparkles, BookOpen, Brain, GraduationCap, Target } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/data/weeklyData";
const Index = () => {
  const {
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
    totalWeeks,
    weekData,
  } = useHabitTracker();

  const handleAddTask = (category: string, task: Task) => {
    addCustomTask(currentWeek, category, task);
  };

  const handleRemoveTask = (category: string, taskId: string) => {
    removeTask(currentWeek, taskId);
  };

  useTheme(); // Initialize theme

  const dailyTasks = getWeekDailyTasks(currentWeek);
  const overallProgress = calculateOverallProgress();
  const weekNotes = getWeekNotes(currentWeek);

  if (!weekData) return null;

  const allTasks = [...weekData.japanese, ...weekData.aiml, ...weekData.college, ...weekData.goals];
  const weekProgress = getTaskCompletionForWeek(currentWeek, allTasks).percentage;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`MEXT Journey - Week ${weekData.weekNumber}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`${weekData.startDate} - ${weekData.endDate}, ${weekData.year}`, 20, 30);
    doc.text(`Phase: ${weekData.phase} | Focus: ${weekData.focus}`, 20, 40);
    
    let y = 55;
    const sections = [
      { title: 'Japanese Learning', tasks: weekData.japanese },
      { title: 'AI/ML Work', tasks: weekData.aiml },
      { title: 'College Work', tasks: weekData.college },
      { title: 'Weekly Goals', tasks: weekData.goals },
    ];

    sections.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 20, y);
      y += 8;
      doc.setFontSize(10);
      section.tasks.forEach(task => {
        const taskDays = dailyTasks[task.id] || [false, false, false, false, false, false, false];
        const completed = taskDays.filter(Boolean).length;
        doc.text(`☐ ${task.text} (${completed}/7 days)`, 25, y);
        y += 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
      y += 5;
    });

    doc.save(`mext-week-${weekData.weekNumber}.pdf`);
    toast({ title: "PDF Downloaded!", description: `Week ${weekData.weekNumber} saved.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-theme pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6 fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Plane className="w-7 h-7 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">MEXT Journey Tracker</h1>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">Your Complete Roadmap to AI/ML Master's in Japan</p>
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

        {/* Main Layout */}
        <div className="flex gap-6 mt-6">
          <Sidebar
            weekProgress={weekProgress}
            monthProgress={weekProgress}
            weeksCompleted={getWeeksCompleted()}
            totalWeeks={totalWeeks}
            streak={streak}
            currentWeek={weekData}
          />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <DailyTaskGrid
              title="Japanese Learning"
              icon={<BookOpen className="w-5 h-5" />}
              tasks={weekData.japanese}
              category="japanese"
              dailyTasks={dailyTasks}
              onToggle={(taskId, dayIndex) => toggleDailyTask(currentWeek, taskId, dayIndex)}
            />
            
            <DailyTaskGrid
              title="AI/ML Work"
              icon={<Brain className="w-5 h-5" />}
              tasks={weekData.aiml}
              category="aiml"
              dailyTasks={dailyTasks}
              onToggle={(taskId, dayIndex) => toggleDailyTask(currentWeek, taskId, dayIndex)}
            />
            
            <DailyTaskGrid
              title="College Work"
              icon={<GraduationCap className="w-5 h-5" />}
              tasks={weekData.college}
              category="college"
              dailyTasks={dailyTasks}
              onToggle={(taskId, dayIndex) => toggleDailyTask(currentWeek, taskId, dayIndex)}
            />
            
            <DailyTaskGrid
              title="Weekly Goals"
              icon={<Target className="w-5 h-5" />}
              tasks={weekData.goals}
              category="goals"
              dailyTasks={dailyTasks}
              onToggle={(taskId, dayIndex) => toggleDailyTask(currentWeek, taskId, dayIndex)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Notes notes={weekNotes} onSave={(n) => updateWeekNotes(currentWeek, n)} />
              <WeekSummary week={weekData} dailyTasks={dailyTasks} streak={streak} onDownloadPDF={handleDownloadPDF} />
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>頑張って! (Ganbatte!) — Good luck on your MEXT journey!</p>
        </footer>
      </div>

      {/* AI Chatbot */}
      <Chatbot 
        weekData={weekData}
        onAddTask={handleAddTask}
        onRemoveTask={handleRemoveTask}
      />
    </div>
  );
};

export default Index;
