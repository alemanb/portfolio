import { motion } from "motion/react";
import { revealVariants } from "../../lib/motion";
import type { Experience } from "../../types/portfolio";

interface ExperiencePanelProps {
  experience: Experience[];
}

export function ExperiencePanel({ experience }: ExperiencePanelProps) {
  return (
    // 12 between roles: each one is its own region, not a sibling item.
    <ol className="flex flex-col gap-12">
      {experience.map((role) => (
        <motion.li
          key={role.id}
          variants={revealVariants}
          className="relative border-l border-line pl-6"
        >
          {/* Timeline node. The ring blends it into the panel background. */}
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[4.5px] size-2 rounded-full bg-accent ring-4 ring-surface"
          />

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-base font-medium text-ink">{role.role}</h2>
            <span className="text-xs text-faint">{role.period}</span>
          </div>

          <p className="mt-1 text-sm text-accent">{role.company}</p>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {role.description}
          </p>

          <ul className="mt-4 flex flex-col gap-2">
            {role.achievements.map((achievement) => (
              <li
                key={achievement}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-3 shrink-0 bg-line-strong"
                />
                {achievement}
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </ol>
  );
}
