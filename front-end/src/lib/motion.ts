import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary. Keeping easings and variants in one module is what
 * makes every transition on the site feel like it belongs to the same object.
 *
 * `MotionConfig reducedMotion="user"` in `App.tsx` strips the transform parts
 * of these variants automatically when the OS asks for reduced motion, so the
 * definitions below stay free of accessibility branching.
 */

/** Decelerating curve used for anything entering the screen. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Gentle acceleration into a long, slow settle. For something crossing the
 * whole viewport, where a pure ease-out would have it already at full speed on
 * the first frame it becomes visible.
 */
export const EASE_IN_OUT = [0.45, 0, 0.25, 1] as const;

/** Physics for the sliding tab indicator. Snappy, no overshoot wobble. */
export const INDICATOR_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 38,
  mass: 0.8,
};

/**
 * The window's contents booting in once the intro orb has become the frame.
 * The container itself stays invisible and only sets the rhythm; its motion
 * descendants (title bar, rail, panel) inherit the state through context and
 * arrive one after another.
 */
export const bootContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.13 },
  },
};

export const bootItem: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
};

/**
 * Panel enter/exit. `custom` carries the nav direction so content always
 * travels the way the user scrolled: forward pushes up, backward pulls down.
 */
export const panelVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 24 : -24,
  }),
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: EASE_OUT,
      delayChildren: 0.06,
      staggerChildren: 0.05,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -16 : 16,
    transition: { duration: 0.16, ease: "easeIn" },
  }),
};

/**
 * Child variant. Names match `panelVariants` so children inherit the parent's
 * state through context and pick up its stagger for free.
 */
export const revealVariants: Variants = {
  enter: { opacity: 0, y: 12 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
