import { ExternalLink } from "lucide-react";
import { Ripple } from "../ui/ripple";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image: string;
}

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section className="w-full py-24 px-6 bg-background">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Ripple mainCircleSize={100} numCircles={5} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 flex items-center justify-between">
                  {project.title}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  </a>
                </h3>

                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
