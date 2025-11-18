interface AboutProps {
  about: {
    description: string;
    highlights: string[];
  };
}

export function About({ about }: AboutProps) {
  return (
    <section className="w-full py-24 px-6 bg-muted/30">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          About Me
        </h2>

        <div className="prose prose-lg max-w-none mb-4">
          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
            {about.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {about.highlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-background border border-border hover:border-primary/50 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-foreground">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
