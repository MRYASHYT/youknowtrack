import { Task } from "@/data/weeklyData";
import { TaskItem } from "./TaskItem";
import { BookOpen, Brain, GraduationCap, Target } from "lucide-react";

interface CategorySectionProps {
  title: string;
  category: 'japanese' | 'aiml' | 'college' | 'goals';
  tasks: Task[];
  completedTasks: Set<string>;
  onToggleTask: (taskId: string) => void;
}

const categoryConfig = {
  japanese: {
    icon: BookOpen,
    gradient: 'from-japanese/20 to-japanese/5',
    border: 'border-japanese/30',
    dot: 'bg-japanese',
    iconColor: 'text-japanese',
  },
  aiml: {
    icon: Brain,
    gradient: 'from-aiml/20 to-aiml/5',
    border: 'border-aiml/30',
    dot: 'bg-aiml',
    iconColor: 'text-aiml',
  },
  college: {
    icon: GraduationCap,
    gradient: 'from-college/20 to-college/5',
    border: 'border-college/30',
    dot: 'bg-college',
    iconColor: 'text-college',
  },
  goals: {
    icon: Target,
    gradient: 'from-goals/20 to-goals/5',
    border: 'border-goals/30',
    dot: 'bg-goals',
    iconColor: 'text-goals',
  },
};

export const CategorySection = ({ 
  title, 
  category, 
  tasks, 
  completedTasks, 
  onToggleTask 
}: CategorySectionProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;
  const completedCount = tasks.filter(t => completedTasks.has(t.id)).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  if (tasks.length === 0) return null;

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${config.gradient} border ${config.border} slide-in`}>
      <div className="category-header">
        <div className={`category-dot ${config.dot}`} />
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
        <h3 className="font-semibold text-foreground flex-1">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{tasks.length}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div 
          className={`progress-fill ${config.dot}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isCompleted={completedTasks.has(task.id)}
            onToggle={() => onToggleTask(task.id)}
            category={category}
          />
        ))}
      </div>
    </div>
  );
};
