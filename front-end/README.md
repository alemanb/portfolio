# Benjamin Aleman, Portfolio

A personal portfolio shaped like Chrome's vertical tab browser: a centered dark
window with a tab rail down the left, and one panel of content at a time.
Clicking a tab, scrolling past a panel's edge, pressing the up and down arrows,
or hitting a number key all move through the same set of sections.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle to dist/
npm run lint
```

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 (CSS-first `@theme`) ·
Motion 12 · lucide-react

## How it fits together

```
src/
├── tabs.tsx                  # THE REGISTRY: one entry per section
├── App.tsx                   # wires router + gestures + hotkeys to the layout
├── data/portfolio.ts         # all site content, typed
├── types/portfolio.ts        # content schema
├── hooks/
│   ├── useTabRouter.ts       # active tab  <->  URL fragment
│   ├── useSequentialNavigation.ts # wheel, swipe & arrows -> tabs
│   └── useTabHotkeys.ts      # number keys 1-6
├── lib/motion.ts             # shared easings and variants
├── components/layout/        # BrowserFrame, TabRail, TabViewport
├── components/panels/        # one component per section
└── components/ui/            # Reveal, Tag, ActionLink, PanelHeader
```

### The registry is the source of truth

`src/tabs.tsx` exports one array. The rail, the URL router, the keyboard
shortcuts, the document title, and the rendered panel all read from it, so
**adding a section means adding one entry**, with no other file changes:

```tsx
{
  id: "writing",                    // also the URL: /#writing
  label: "Writing",
  description: "Notes on things I've been building.",
  icon: PenLine,
  render: ({ data }) => <WritingPanel posts={data.writing} />,
}
```

The `render` adapter hands each panel only the slice of data it needs, so panels
never depend on the global content shape.

### Content vs. layout

`src/data/portfolio.ts` is the only file to edit for copy changes. It's typed by
`src/types/portfolio.ts`, so a typo is a build error rather than a blank spot on
the page.

### Navigation

Four inputs, one state owner (`useTabRouter`), which also mirrors the active tab
into the URL fragment, so every section is deep-linkable and the browser's
back/forward buttons walk the tab history.

Scroll-to-switch is **edge-aware**: a gesture only changes tabs once the panel
has nothing left to scroll in that direction, so long panels scroll normally and
hand off at the boundary. A cooldown that the trackpad's own momentum tail
extends means one flick advances exactly one tab.

### Motion

`lib/motion.ts` holds every easing and variant. Panels animate in a direction
derived from how you navigated, and children stagger by inheriting the panel's
variant state through context rather than declaring their own timing.

`<MotionConfig reducedMotion="user">` in `App.tsx` strips transforms when the OS
asks for reduced motion, so no component needs accessibility branching.

### Theming

All colors, fonts, and easings are Tailwind v4 `@theme` tokens in
`src/index.css`. Each becomes both a utility (`bg-surface`, `text-muted`) and a
CSS variable, so the palette has exactly one definition. Retheming the site is
editing that one block.

Spacing follows a four-step rhythm, documented at the top of `src/index.css`:
`2` inside an item, `4` between siblings, `8` between groups, `12` between
regions. Gaps come from that list and nothing else, which is what makes a group
of related things read as a group.

## Accessibility

- The rail is a real ARIA `tablist` with roving tabindex; arrow keys, `Home`,
  and `End` behave as the pattern specifies.
- Panels are `tabpanel`s wired to their tabs via `aria-controls` /
  `aria-labelledby`.
- Focus rings appear for keyboard users only (`:focus-visible`).
- Reduced motion is respected in both CSS and Motion.
