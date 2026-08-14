import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import type { TabId } from "../../tabs";
import type { Profile } from "../../types/portfolio";
import { ActionLink } from "../ui/ActionLink";
import { Reveal } from "../ui/Reveal";

interface HomePanelProps {
  profile: Profile;
  /** Jumps to another tab; used by the "start here" shortcuts. */
  navigate: (id: string) => void;
}

/**
 * Typed against the registry's literal ids (a type-only import, so it adds no
 * runtime dependency): renaming a tab breaks the build here rather than leaving
 * a dead link on the page.
 */
const SHORTCUTS: { id: TabId; label: string }[] = [
  { id: "projects", label: "See what I've built" },
  { id: "experience", label: "Where I've worked" },
  { id: "contact", label: "Get in touch" },
];

export function HomePanel({ profile, navigate }: HomePanelProps) {
  return (
    // `my-auto` rather than `justify-center` on a flex parent: auto margins
    // centre the panel when there is room, then collapse to 0 when the content
    // is taller than the viewport. Centring would instead overflow equally in
    // both directions, and anything pushed above a scroll container's top edge
    // cannot be scrolled back to.
    <div className="my-auto w-full">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
        {/* Text first in the DOM so the heading leads for assistive tech; the
            order utilities only change where it sits visually. */}
        <div className="order-last min-w-0 flex-1 md:order-first">
          <Reveal>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {profile.title}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-faint">
              <MapPin className="size-3.5" />
              {profile.location}
            </p>
          </Reveal>

          <Reveal className="mt-8">
            <div className="flex flex-wrap gap-2">
              <ActionLink href={profile.github} icon={Github} label="GitHub" />
              <ActionLink
                href={profile.linkedin}
                icon={Linkedin}
                label="LinkedIn"
              />
              <ActionLink
                href={`mailto:${profile.email}`}
                icon={Mail}
                label="Email"
              />
            </div>
          </Reveal>

        </div>

        {profile.image && (
          <Reveal className="shrink-0">
            {/* Height is left to the intrinsic ratio, so the whole frame shows
                rather than being cropped to fit a fixed box. */}
            <img
              src={profile.image}
              // Decorative: the name sits right beside it in text.
              alt=""
              className="w-40 rounded-xl border border-line object-contain shadow-lg shadow-black/40 md:w-64"
            />
          </Reveal>
        )}
      </div>

      {/* Outside the two-column row, so its rule spans the full panel and the
          photo sits above it rather than alongside it. */}
      <Reveal className="mt-12 border-t border-line pt-8">
        <p className="mb-4 text-[11px] tracking-widest text-faint uppercase">
          Start here
        </p>
        <ul className="flex flex-col gap-2">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.id}>
              <button
                type="button"
                onClick={() => navigate(shortcut.id)}
                className="group flex items-center gap-2 rounded-md text-left text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                <span className="text-faint transition-colors duration-200 group-hover:text-accent">
                  &rarr;
                </span>
                {shortcut.label}
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
