import { cn } from "../../lib/utils";

interface TagProps {
  children: string;
  className?: string;
}

/** Small chip used for technologies and skills. */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "rounded-md border border-line bg-raised/60 px-2 py-1",
        // 12px rather than the 11px the monospace cut used to carry: a
        // proportional face at the same size reads noticeably lighter.
        "text-xs leading-none text-muted",
        "transition-colors duration-200 hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
