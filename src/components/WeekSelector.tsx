import { useState } from "react";
import { weeklyData } from "@/data/weeklyData";
import { ChevronDown, Search } from "lucide-react";

interface WeekSelectorProps {
  currentWeek: number;
  onSelectWeek: (week: number) => void;
}

export const WeekSelector = ({ currentWeek, onSelectWeek }: WeekSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const phases = [
    { name: "Foundations", weeks: weeklyData.filter(w => w.phase === "Foundations") },
    { name: "Core Building", weeks: weeklyData.filter(w => w.phase === "Core Building") },
    { name: "Advanced Building", weeks: weeklyData.filter(w => w.phase === "Advanced Building") },
    { name: "Applications", weeks: weeklyData.filter(w => w.phase === "Applications") },
    { name: "Final Preparation", weeks: weeklyData.filter(w => w.phase === "Final Preparation") },
  ];

  const filteredPhases = phases.map(phase => ({
    ...phase,
    weeks: phase.weeks.filter(w => 
      w.weekNumber.toString().includes(search) ||
      w.month.toLowerCase().includes(search.toLowerCase()) ||
      w.focus.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(phase => phase.weeks.length > 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <span className="text-sm font-medium">Jump to Week</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-xl bg-card border border-border shadow-xl z-50 fade-in">
            {/* Search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search weeks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Weeks list */}
            <div className="max-h-72 overflow-y-auto">
              {filteredPhases.map((phase) => (
                <div key={phase.name}>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-secondary/50 sticky top-0">
                    {phase.name}
                  </div>
                  {phase.weeks.map((week) => (
                    <button
                      key={week.weekNumber}
                      onClick={() => {
                        onSelectWeek(week.weekNumber);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-secondary transition-colors ${
                        week.weekNumber === currentWeek ? 'bg-primary/20' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground">
                        Week {week.weekNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {week.month} {week.year} • {week.focus}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
