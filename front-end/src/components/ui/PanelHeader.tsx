import { Reveal } from "./Reveal";

interface PanelHeaderProps {
  /** 1-based position of the tab, rendered as a monospace kicker. */
  index: number;
  label: string;
  description: string;
}

/**
 * Rendered by the viewport from the tab registry rather than by each panel, so
 * every section gets an identical header without six copies of the markup.
 */
export function PanelHeader({ index, label, description }: PanelHeaderProps) {
  return (
    // 12 below: the header is a region break, not just another block.
    <Reveal className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        {/* tabular-nums keeps the sequence a uniform width now that a
            monospace face is no longer doing that job. */}
        <span className="font-display text-[11px] font-semibold tracking-widest text-accent tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        {label}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-faint">
        {description}
      </p>
    </Reveal>
  );
}
