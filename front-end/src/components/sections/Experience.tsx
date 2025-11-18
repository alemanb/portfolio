import { CheckCircle2 } from "lucide-react";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <section className="w-full py-24 px-6 bg-muted/30">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Experience
        </h2>

        <div className="space-y-12">
          {experience.map((item, index) => (
            <div
              key={index}
              className="relative pl-8 border-l-2 border-primary/30 hover:border-primary transition-colors"
            >
              <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-primary border-4 border-background" />

              <div className="mb-2">
                <h3 className="text-2xl font-bold">{item.role}</h3>
                <p className="text-lg text-muted-foreground">{item.company}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.period}
                </p>
              </div>

              <p className="text-muted-foreground mb-4 leading-relaxed">
                {item.description}
              </p>

              <ul className="space-y-3">
                {item.achievements.map((achievement, achIndex) => (
                  <li
                    key={achIndex}
                    className="flex items-start gap-3 text-sm group"
                  >
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary/70 group-hover:text-primary transition-colors shrink-0" />
            <span className="text-muted-foreground leading-relaxed">{achievement}</span>                   </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
