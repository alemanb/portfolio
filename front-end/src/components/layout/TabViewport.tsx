import { AnimatePresence, motion } from "motion/react";
import type { RefObject } from "react";
import type { NavDirection } from "../../hooks/useTabRouter";
import { bootItem, panelVariants } from "../../lib/motion";
import type { PanelContext, TabDefinition } from "../../tabs";
import { PanelHeader } from "../ui/PanelHeader";

interface TabViewportProps {
  tab: TabDefinition;
  /** Zero-based position, rendered as the header's kicker. */
  index: number;
  direction: NavDirection;
  /** The scroll container, shared with `useSequentialNavigation`. */
  scrollRef: RefObject<HTMLDivElement | null>;
  context: PanelContext;
}

/**
 * Scroll container plus the panel swap.
 *
 * `mode="wait"` lets the outgoing panel finish before the next one enters, so
 * the two never overlap inside a fixed-height window; `custom` threads the
 * navigation direction into the variants so content always travels the way the
 * user scrolled.
 */
export function TabViewport({
  tab,
  index,
  direction,
  scrollRef,
  context,
}: TabViewportProps) {
  return (
    <motion.div
      ref={scrollRef}
      // Takes its turn in the frame's boot stagger, inherited through context.
      variants={bootItem}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hidden"
    >
      {/* `initial` is left on so the first panel plays its staggered entrance
          as part of the opening sequence, not just on later tab switches. */}
      <AnimatePresence
        mode="wait"
        custom={direction}
        // Reset after the old panel leaves rather than on tab change, so the
        // outgoing content doesn't jump while it's still animating out.
        onExitComplete={() => {
          if (scrollRef.current) scrollRef.current.scrollTop = 0;
        }}
      >
        <motion.section
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={-1}
          custom={direction}
          variants={panelVariants}
          initial="enter"
          animate="center"
          exit="exit"
          // A full-height flex column, so panels that want to fill or center
          // themselves can just claim `flex-1` instead of relying on a
          // percentage height resolving against an auto-height parent.
          className="flex min-h-full flex-col p-6 md:p-12"
        >
          {!tab.hideHeader && (
            <PanelHeader
              index={index + 1}
              label={tab.label}
              description={tab.description}
            />
          )}
          {tab.render(context)}
        </motion.section>
      </AnimatePresence>
    </motion.div>
  );
}
