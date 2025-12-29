import { Check, ExternalLink } from "lucide-react";
import { Task } from "@/data/weeklyData";

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  category: 'japanese' | 'aiml' | 'college' | 'goals';
}

const categoryColors = {
  japanese: 'text-japanese',
  aiml: 'text-aiml',
  college: 'text-college',
  goals: 'text-goals',
};

export const TaskItem = ({ task, isCompleted, onToggle, category }: TaskItemProps) => {
  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''} fade-in`}>
      <button
        onClick={onToggle}
        className={`checkbox-custom flex-shrink-0 ${isCompleted ? 'checked animate-check' : ''}`}
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span className={`task-text text-sm leading-relaxed ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
            {task.text}
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          {task.schedule && (
            <span className="text-xs text-muted-foreground">
              {task.schedule}
            </span>
          )}
          
          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-resource flex items-center gap-1 ${categoryColors[category]}`}
              onClick={(e) => e.stopPropagation()}
            >
              {task.linkText || 'Link'}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
