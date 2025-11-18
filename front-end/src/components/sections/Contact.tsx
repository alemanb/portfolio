import { Github, Linkedin, Mail } from "lucide-react";
import { Ripple } from "../ui/ripple";

interface ContactProps {
  profile: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
  };
}

export function Contact({ profile }: ContactProps) {
  return (
    <section className="relative w-full py-24 px-6 bg-muted/30 overflow-hidden">
      <Ripple className="opacity-50" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Let's Work Together
        </h2>

        <p className="text-xl text-muted-foreground mb-4">
          I'm always interested in hearing about new projects and opportunities.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <a
            href={`mailto:${profile.email}?subject=Hello from your Portfolio`}
            className="flex items-center gap-3 px-8 py-4 rounded-lg border border-border bg-white text-foreground hover:border-foreground transition-all hover:scale-105"
            aria-label="Send email to Benjamin"
          >
            <Mail className="w-5 h-5" />
            <span className="font-medium">Send Email</span>
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-lg border border-border bg-white text-foreground hover:border-foreground transition-all hover:scale-105"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">GitHub</span>
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-lg border border-border bg-white text-foreground hover:border-foreground transition-all hover:scale-105"
          >
            <Linkedin className="w-5 h-5" />
            <span className="font-medium">LinkedIn</span>
          </a>
        </div>

        <footer className="pt-8 border-t border-border">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. Built with React and
            MagicUI.
          </p>
        </footer>
      </div>
    </section>
  );
}
