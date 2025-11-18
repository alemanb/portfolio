import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Skills } from "./components/sections/Skills";
import { Contact } from "./components/sections/Contact";
import { portfolioData } from "./data/portfolio";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Hero profile={portfolioData.profile} />
      <About about={portfolioData.about} />
      <Projects projects={portfolioData.projects} />
      <Experience experience={portfolioData.experience} />
      <Skills skills={portfolioData.skills} />
      <Contact profile={portfolioData.profile} />
    </div>
  );
}

export default App;
