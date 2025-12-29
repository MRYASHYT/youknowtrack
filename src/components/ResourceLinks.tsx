import { ExternalLink, Link2 } from "lucide-react";

interface Resource {
  title: string;
  url: string;
}

interface ResourceLinksProps {
  resources: Resource[];
}

export const ResourceLinks = ({ resources }: ResourceLinksProps) => {
  if (!resources || resources.length === 0) return null;

  return (
    <div className="glass-card p-5 fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Additional Resources</h3>
      </div>
      
      <div className="grid gap-2">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
          >
            <ExternalLink className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {resource.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
