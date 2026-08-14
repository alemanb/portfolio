import { GraduationCap } from "lucide-react";
import type { About } from "../../types/portfolio";
import { Reveal } from "../ui/Reveal";

interface AboutPanelProps {
  about: About;
}

/**
 * Three blocks, each one a `Reveal`: prose, focus areas, education. Grouping
 * the stagger by block instead of by element is what makes them read as three
 * things rather than seven.
 */
export function AboutPanel({ about }: AboutPanelProps) {
  return (
    <div className="max-w-2xl">
      <Reveal className="space-y-4">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[15px] leading-7 text-muted">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <Reveal className="mt-8">
        <h2 className="mb-4 text-[11px] tracking-widest text-faint uppercase">
          What I focus on
        </h2>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {about.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-sm text-muted"
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-px w-4 shrink-0 bg-accent-dim"
              />
              {highlight}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex items-start gap-4 rounded-lg border border-line bg-raised/40 p-5">
          <GraduationCap className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <p className="text-sm text-ink">{about.education.school}</p>
            <p className="text-xs text-faint">
              {about.education.degree}
              {about.education.detail && ` · ${about.education.detail}`}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
