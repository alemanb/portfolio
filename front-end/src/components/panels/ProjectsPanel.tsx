import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { revealVariants } from "../../lib/motion";
import type { Project } from "../../types/portfolio";
import { Tag } from "../ui/Tag";

interface ProjectsPanelProps {
  projects: Project[];
}

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  return (
    <ul className="flex flex-col gap-4">
      {projects.map((project, index) => (
        // The <li> animates directly rather than through a wrapper: an element
        // with `display: contents` has no box, so transforms would do nothing.
        <motion.li key={project.id} variants={revealVariants}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-line bg-raised/30 p-5 transition-colors duration-200 hover:border-accent-dim hover:bg-raised/70"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[11px] font-semibold text-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="flex-1 text-base font-medium text-ink">
                {project.title}
              </h2>
              <ArrowUpRight className="size-4 shrink-0 self-center text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </a>
        </motion.li>
      ))}
    </ul>
  );
}
