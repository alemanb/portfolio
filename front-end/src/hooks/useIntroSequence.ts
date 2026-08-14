import { useEffect, useState } from "react";

/**
 * `travel` : a small orb drifts in from the right and settles in the middle.
 * `expand` : that orb morphs into the browser window.
 * `ready`  : the chrome and content boot in.
 */
export type IntroPhase = "travel" | "expand" | "ready";

/** How long the orb spends crossing the screen. */
export const INTRO_TRAVEL_MS = 640;
/**
 * How long the orb takes to become the window.
 *
 * Comfortably longer than the 600ms morph itself: reaching `ready` is what
 * switches the frame's `layout` projection off, and doing that mid-animation
 * would snap the frame to its final box.
 */
export const INTRO_EXPAND_MS = 720;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives the one-time opening animation.
 *
 * The phase is read from the media query during the initial state calculation
 * rather than in an effect, so a visitor who asked for reduced motion never
 * sees a frame of the orb before it is skipped.
 */
export function useIntroSequence(): IntroPhase {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    prefersReducedMotion() ? "ready" : "travel",
  );

  useEffect(() => {
    if (phase === "ready") return;

    const toExpand = setTimeout(() => setPhase("expand"), INTRO_TRAVEL_MS);
    const toReady = setTimeout(
      () => setPhase("ready"),
      INTRO_TRAVEL_MS + INTRO_EXPAND_MS,
    );

    return () => {
      clearTimeout(toExpand);
      clearTimeout(toReady);
    };
    // Runs once: the timers own the rest of the sequence.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return phase;
}
