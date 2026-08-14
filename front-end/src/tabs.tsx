/* eslint-disable react-refresh/only-export-components --
   This is a data module that happens to contain JSX in its render adapters; it
   exports no components of its own. The only cost is that editing this file
   triggers a full reload instead of a hot update. */
import {
  Briefcase,
  FolderGit2,
  Layers,
  Send,
  SquareUser,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { AboutPanel } from "./components/panels/AboutPanel";
import { ContactPanel } from "./components/panels/ContactPanel";
import { ExperiencePanel } from "./components/panels/ExperiencePanel";
import { HomePanel } from "./components/panels/HomePanel";
import { ProjectsPanel } from "./components/panels/ProjectsPanel";
import { SkillsPanel } from "./components/panels/SkillsPanel";
import type { PortfolioData } from "./types/portfolio";

/** Everything a panel is allowed to reach for. */
export interface PanelContext {
  data: PortfolioData;
  /** Jump to another tab by id. */
  navigate: (id: string) => void;
}

export interface TabDefinition {
  /** Also the URL fragment (`/#projects`) and the ARIA id prefix. */
  id: string;
  label: string;
  /** Sub-heading shown by the shared panel header. */
  description: string;
  icon: LucideIcon;
  /** Set when the panel provides its own headline treatment. */
  hideHeader?: boolean;
  render: (context: PanelContext) => ReactNode;
}

/**
 * The tab registry, the site's single source of truth.
 *
 * The rail, the URL router, the keyboard shortcuts, the document title and the
 * rendered panel all read from this array, so adding a section means adding one
 * entry here and nothing else. The `render` adapters keep panels decoupled from
 * the shape of the data file: each receives only the slice it needs.
 */
const TAB_LIST = [
  {
    id: "home",
    label: "Home",
    description: "",
    icon: Terminal,
    hideHeader: true,
    render: ({ data, navigate }) => (
      <HomePanel profile={data.profile} navigate={navigate} />
    ),
  },
  {
    id: "about",
    label: "About",
    description: "A bit about me and what I like building.",
    icon: SquareUser,
    render: ({ data }) => <AboutPanel about={data.about} />,
  },
  {
    id: "projects",
    label: "Projects",
    description: "Stuff I've built, from AI systems to music tech.",
    icon: FolderGit2,
    render: ({ data }) => <ProjectsPanel projects={data.projects} />,
  },
  {
    id: "experience",
    label: "Experience",
    description: "Where I've worked and what I actually shipped.",
    icon: Briefcase,
    render: ({ data }) => <ExperiencePanel experience={data.experience} />,
  },
  {
    id: "skills",
    label: "Skills",
    description: "The tools and tech I work with.",
    icon: Layers,
    render: ({ data }) => <SkillsPanel skills={data.skills} />,
  },
  {
    id: "contact",
    label: "Contact",
    description: "The best ways to reach me.",
    icon: Send,
    render: ({ data }) => <ContactPanel profile={data.profile} />,
  },
] as const satisfies readonly TabDefinition[];

/**
 * Literal union of the ids above, e.g. `"about" | "projects" | ...`.
 *
 * `as const satisfies` is doing real work here: `satisfies` still type-checks
 * every entry against `TabDefinition`, while `as const` preserves the literal
 * ids so anything that links to a tab (see `HomePanel`) is verified at compile
 * time instead of failing silently at runtime.
 */
export type TabId = (typeof TAB_LIST)[number]["id"];

/**
 * The same array, widened back to the interface so consumers see optional
 * members such as `hideHeader` on every entry, not just on the ones that set
 * it.
 */
export const TABS: readonly TabDefinition[] = TAB_LIST;

/**
 * Module-level constant so the router's callbacks stay referentially stable
 * across renders.
 */
export const TAB_IDS: readonly TabId[] = TAB_LIST.map((tab) => tab.id);
