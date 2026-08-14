import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface ActionLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  /** Secondary line, shown only by the `card` variant. */
  sublabel?: string;
  /** `pill` for inline rows of links, `card` for a stacked contact list. */
  variant?: "pill" | "card";
  className?: string;
}

/**
 * One link primitive for every outbound destination, so hover, focus and the
 * `noopener` hardening are defined once instead of per section.
 */
export function ActionLink({
  href,
  icon: Icon,
  label,
  sublabel,
  variant = "pill",
  className,
}: ActionLinkProps) {
  const isExternal = href.startsWith("http");
  const shared =
    "group inline-flex items-center border border-line bg-raised/40 text-muted " +
    "transition-colors duration-200 hover:border-accent-dim hover:bg-raised hover:text-ink";

  if (variant === "card") {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={cn(shared, "w-full gap-4 rounded-lg px-5 py-4", className)}
      >
        <Icon className="size-4 shrink-0 text-faint transition-colors duration-200 group-hover:text-accent" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-ink">{label}</span>
          {sublabel && (
            <span className="block truncate text-xs text-faint">
              {sublabel}
            </span>
          )}
        </span>
        <ArrowUpRight className="size-4 shrink-0 text-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(shared, "gap-2 rounded-lg px-4 py-2.5 text-sm", className)}
    >
      <Icon className="size-4 transition-colors duration-200 group-hover:text-accent" />
      {label}
    </a>
  );
}
