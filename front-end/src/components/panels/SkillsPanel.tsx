import { motion } from "motion/react";
import { revealVariants } from "../../lib/motion";
import type { SkillGroup } from "../../types/portfolio";
import { Tag } from "../ui/Tag";

interface SkillsPanelProps {
  skills: SkillGroup[];
}

export function SkillsPanel({ skills }: SkillsPanelProps) {
  return (
    <dl className="flex flex-col">
      {skills.map((group) => (
        // py-4 on each row puts a consistent 8 (32px) between groups, with the
        // hairline sitting exactly in the middle of it.
        <motion.div
          key={group.label}
          variants={revealVariants}
          className="grid gap-2 border-t border-line py-4 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-x-8"
        >
          <dt className="text-[11px] tracking-widest text-faint uppercase sm:pt-1">
            {group.label}
          </dt>
          <dd className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}
