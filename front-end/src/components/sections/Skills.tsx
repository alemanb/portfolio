interface SkillsData {
  languages: string[];
  frameworks: string[];
  tools: string[];
  concepts: string[];
}

interface SkillsProps {
  skills: SkillsData;
}

const SkillCategory = ({ title, items }: { title: string; items: string[] }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-center">{title}</h3>
    <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-3 py-2 text-sm rounded-lg bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-default"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export function Skills({ skills }: SkillsProps) {
  return (
    <section className="w-full py-24 px-6 bg-background">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Skills & Technologies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <SkillCategory title="Languages" items={skills.languages} />
          <SkillCategory title="Frameworks" items={skills.frameworks} />
          <SkillCategory title="Tools & Platforms" items={skills.tools} />
          <SkillCategory title="Concepts" items={skills.concepts} />
        </div>
      </div>
    </section>
  );
}
