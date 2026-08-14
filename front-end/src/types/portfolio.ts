/**
 * Domain types for portfolio content.
 *
 * Content lives in `src/data/portfolio.ts` and is validated by these types at
 * compile time, so a typo in the data file is a build error rather than a blank
 * spot on the page.
 */

export interface Profile {
  name: string;
  /** Shown under the name on the index panel. */
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  /** Optional headshot in `public/`. Falls back to an initials monogram. */
  image?: string;
}

export interface About {
  /** One or more paragraphs, rendered in order. */
  paragraphs: string[];
  highlights: string[];
  education: {
    school: string;
    degree: string;
    detail?: string;
  };
}

export interface Project {
  /** Stable key; also used as the React list key. */
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface PortfolioData {
  profile: Profile;
  about: About;
  projects: Project[];
  experience: Experience[];
  skills: SkillGroup[];
}
