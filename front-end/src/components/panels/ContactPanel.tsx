import { Github, Linkedin, Mail } from "lucide-react";
import type { Profile } from "../../types/portfolio";
import { ActionLink } from "../ui/ActionLink";
import { Reveal } from "../ui/Reveal";

interface ContactPanelProps {
  profile: Profile;
}

/** Strips the scheme so a URL can be shown as a readable handle. */
const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

export function ContactPanel({ profile }: ContactPanelProps) {
  return (
    <div className="flex max-w-2xl flex-1 flex-col">
      <Reveal>
        <p className="text-lg leading-relaxed text-muted">
          I'm always interested in hearing about new projects and opportunities.
          Email is the fastest way to reach me.
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-col gap-2">
          <ActionLink
            variant="card"
            href={`mailto:${profile.email}`}
            icon={Mail}
            label="Email"
            sublabel={profile.email}
          />
          <ActionLink
            variant="card"
            href={profile.github}
            icon={Github}
            label="GitHub"
            sublabel={displayUrl(profile.github)}
          />
          <ActionLink
            variant="card"
            href={profile.linkedin}
            icon={Linkedin}
            label="LinkedIn"
            sublabel={displayUrl(profile.linkedin)}
          />
        </div>
      </Reveal>

      <Reveal className="mt-auto">
        <footer className="mt-12 border-t border-line pt-8">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} {profile.name} · Built with React,
            TypeScript, Tailwind, and Motion
          </p>
        </footer>
      </Reveal>
    </div>
  );
}
