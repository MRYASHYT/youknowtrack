import { WeekNotes } from "@/hooks/useHabitTracker";
import { FileText, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

interface NotesProps {
  notes: WeekNotes;
  onSave: (notes: Partial<WeekNotes>) => void;
}

export const Notes = ({ notes, onSave }: NotesProps) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalNotes(notes);
    setHasChanges(false);
  }, [notes]);

  const handleChange = (field: keyof WeekNotes, value: string) => {
    setLocalNotes(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localNotes);
    setHasChanges(false);
    toast({
      title: "Notes saved!",
      description: "Your weekly reflections have been saved.",
    });
  };

  return (
    <div className="glass-card p-5 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Weekly Notes & Reflections</h3>
        </div>
        <Button 
          onClick={handleSave} 
          size="sm" 
          disabled={!hasChanges}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Save Notes
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            What went well this week?
          </label>
          <textarea
            value={localNotes.wentWell}
            onChange={(e) => handleChange('wentWell', e.target.value)}
            placeholder="Celebrate your wins..."
            className="notes-textarea"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Challenges faced
          </label>
          <textarea
            value={localNotes.challenges}
            onChange={(e) => handleChange('challenges', e.target.value)}
            placeholder="What obstacles did you encounter?"
            className="notes-textarea"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground block mb-2">
            Improvements for next week
          </label>
          <textarea
            value={localNotes.improvements}
            onChange={(e) => handleChange('improvements', e.target.value)}
            placeholder="How will you do better?"
            className="notes-textarea"
          />
        </div>
      </div>
    </div>
  );
};
