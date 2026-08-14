import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { IntroPhase } from "../../hooks/useIntroSequence";
import { bootContainer, bootItem, EASE_OUT } from "../../lib/motion";
import { cn } from "../../lib/utils";

interface BrowserFrameProps {
  /** Shown in the faux address bar, mirroring the real URL fragment so the
   *  metaphor stays honest. */
  path: string;
  /** Owned by `App`, since it gates input as well as visuals. */
  phase: IntroPhase;
  children: ReactNode;
}

/**
 * The centered window the whole site lives in, plus the opening animation that
 * creates it: the window starts as a small circle of itself, drifts in from the
 * right, settles in the middle, then unfolds to full size before the chrome and
 * content boot in. Only shape and size change, never color.
 *
 * The morph is one `layout` animation on a single element rather than a
 * crossfade between two. Motion measures the box before and after the class
 * swap and interpolates, correcting the border radius on the way, so the orb
 * and the window are literally the same object.
 */
export function BrowserFrame({ path, phase, children }: BrowserFrameProps) {
  const isExpanded = phase !== "travel";
  const isReady = phase === "ready";

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-void bg-grid p-3 md:p-6">
      {/* Ambient bloom, held back until the window exists so the orb crosses a
          clean background. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExpanded ? 0.07 : 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="pointer-events-none absolute top-[-18%] left-1/2 h-[520px] w-[820px] max-w-[130vw] -translate-x-1/2 rounded-full blur-[110px]"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      {/* The travel lives on this wrapper, the morph on the frame inside it.
          Keeping the transform off the `layout` element avoids Motion having to
          reconcile an animating transform against a box measurement. */}
      <motion.div
        initial={{ x: "45vw", opacity: 0 }}
        animate={{ x: "0vw", opacity: 1 }}
        transition={{
          x: { duration: 0.55, ease: EASE_OUT },
          opacity: { duration: 0.3 },
        }}
        className="flex h-full w-full items-center justify-center"
      >
        <motion.div
          // Only while the orb is becoming the window. `layout` re-measures on
          // every render and scale-corrects its children, so leaving it on for
          // the app's whole life meant each tab switch re-projected the title
          // bar and made its contents shimmer.
          layout={!isReady}
          animate={{ borderRadius: isExpanded ? 12 : 999 }}
          transition={{
            borderRadius: { duration: 0.6, ease: EASE_OUT },
            layout: { duration: 0.6, ease: EASE_OUT },
          }}
          className={cn(
            // Surface and border are the window's own, in both states: the orb
            // is the window, only smaller and round.
            "relative flex flex-col overflow-hidden border border-line bg-surface",
            isExpanded
              ? "h-full max-h-[880px] w-full max-w-5xl shadow-2xl shadow-black/60"
              : "size-16",
          )}
        >
          {isReady && (
            <motion.div
              variants={bootContainer}
              initial="hidden"
              animate="visible"
              className="flex h-full min-h-0 flex-col"
            >
              <motion.header
                variants={bootItem}
                className="flex h-11 shrink-0 items-center gap-3 border-b border-line bg-rail px-4"
              >
                <div aria-hidden="true" className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="size-2.5 rounded-full bg-line-strong" />
                  <span className="size-2.5 rounded-full bg-line-strong" />
                </div>

                {/* Left aligned like a real address bar, which also pins the
                    domain in place: centering it made the whole string shuffle
                    sideways whenever the path length changed. */}
                <div className="mx-auto flex h-6 w-full max-w-xs items-center rounded-md border border-line bg-surface px-3">
                  <span className="truncate text-[11px] text-faint">
                    alemanb.dev
                    {/* Keyed on the path so a switch fades the new segment in.
                        Only opacity animates, so nothing reflows. */}
                    <motion.span
                      key={path}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="text-muted"
                    >
                      /{path}
                    </motion.span>
                  </span>
                </div>

                {/* Balances the traffic lights so the address bar stays centered. */}
                <div aria-hidden="true" className="w-[42px] shrink-0" />
              </motion.header>

              <div className="flex min-h-0 flex-1 flex-col md:flex-row">
                {children}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
