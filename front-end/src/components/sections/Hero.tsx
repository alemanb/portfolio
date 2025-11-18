import { Github, Linkedin, Mail } from "lucide-react";
import { SparklesText } from "../ui/sparkles-text";

interface HeroProps {
  profile: {
    name: string;
    title: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    image: string;
  };
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Dot Pattern Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.5,
          maskImage: 'radial-gradient(circle 600px at center, white, transparent)',
          WebkitMaskImage: 'radial-gradient(circle 600px at center, white, transparent)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-32 text-center">
        {profile.image && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/20 to-secondary/20 blur-2xl" />
              <img
                src={profile.image}
                alt={profile.name}
                className="relative w-48 h-48 rounded-full object-cover border-4 border-background shadow-2xl"
              />
            </div>
          </div>
        )}

        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <SparklesText
            colors={{ first: "#60A5FA", second: "#A78BFA" }}
            sparklesCount={8}
            className="text-5xl md:text-7xl font-bold text-foreground"
          >
            {profile.name}
          </SparklesText>
        </h1>

        <p className="text-2xl md:text-3xl text-muted-foreground mb-4">
          {profile.title}
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          📍 {profile.location}
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-foreground hover:border-foreground transition-all hover:scale-105"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-foreground hover:border-foreground transition-all hover:scale-105"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </a>

          <a
            href={`mailto:${profile.email}?subject=Hello from your Portfolio`}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-foreground hover:border-foreground transition-all hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}
