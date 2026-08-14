import { useEffect, useRef, type RefObject } from "react";
import { isTypingTarget, isWithinTablist } from "../lib/keyboard";

/** Accumulated wheel distance (px) required to commit to a tab change. */
const WHEEL_THRESHOLD = 64;
/** Minimum swipe distance (px) on touch devices. */
const SWIPE_THRESHOLD = 56;
/** How far one arrow press scrolls a panel that still has room. */
const KEY_SCROLL_STEP = 56;
/** How long to ignore input after a switch, so one flick moves one tab. */
const COOLDOWN_MS = 600;
/** A pause this long ends the current gesture (and its momentum tail). */
const IDLE_MS = 150;
/** Sub-pixel slack when testing "is the panel scrolled to the edge?". */
const EDGE_SLACK = 2;

export interface SequentialNavigationOptions {
  /** The scrolling panel. Tab changes only fire at its scroll boundaries. */
  containerRef: RefObject<HTMLElement | null>;
  /** Should return true if a tab change actually happened. */
  onNext: () => boolean;
  onPrev: () => boolean;
  /**
   * Also the re-subscribe trigger. The effect below can only attach once the
   * container exists, and a ref going from null to an element does not cause a
   * re-render, so a container that mounts later (as it does behind the intro
   * animation) must be announced by flipping this.
   */
  enabled?: boolean;
}

/** Normalize line/page-based wheel deltas to pixels. */
function toPixels(event: WheelEvent, viewportHeight: number): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE)
    return event.deltaY * viewportHeight;
  return event.deltaY;
}

/**
 * Turns continuous "keep going in this direction" input into tab changes:
 * scroll wheels, swipes, and the up/down arrow keys.
 *
 * All three obey one rule, which is what keeps them from fighting the user: a
 * gesture only changes tabs once the panel has nothing left to scroll in that
 * direction. Long panels scroll normally and hand off at the edge; short panels
 * hand off immediately. Trackpad momentum is absorbed by a cooldown that the
 * momentum tail itself extends, so a single flick advances exactly one tab.
 *
 * Arrows scroll the panel themselves rather than deferring to the browser,
 * because the scroll container is not focusable and native key scrolling would
 * only apply when focus happened to be inside it.
 */
export function useSequentialNavigation({
  containerRef,
  onNext,
  onPrev,
  enabled = true,
}: SequentialNavigationOptions): void {
  // Latest-callback refs keep the effect's dependency list stable, so gesture
  // state survives the re-render that a tab change causes.
  const handlers = useRef({ onNext, onPrev });
  useEffect(() => {
    handlers.current = { onNext, onPrev };
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    let accumulated = 0;
    let lockedUntil = 0;
    let lastEventAt = 0;

    const atEdge = (goingForward: boolean) => {
      if (goingForward) {
        const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
        return remaining <= EDGE_SLACK;
      }
      return el.scrollTop <= EDGE_SLACK;
    };

    const commit = (goingForward: boolean, now: number) => {
      const moved = goingForward
        ? handlers.current.onNext()
        : handlers.current.onPrev();
      accumulated = 0;
      // Only lock when we actually moved. At the first/last tab the user
      // should stay free to keep scrolling.
      if (moved) lockedUntil = now + COOLDOWN_MS;
      return moved;
    };

    const onWheel = (event: WheelEvent) => {
      const now = performance.now();
      const idle = now - lastEventAt > IDLE_MS;
      lastEventAt = now;
      if (idle) accumulated = 0;

      // Inside the cooldown: swallow the event and let the momentum tail push
      // the lock forward, so decelerating scroll never spills into a 2nd tab.
      if (now < lockedUntil) {
        lockedUntil = Math.max(lockedUntil, now + IDLE_MS);
        return;
      }

      const delta = toPixels(event, el.clientHeight);
      if (Math.abs(delta) < 1) return;

      // Reversing direction mid-gesture starts a fresh count.
      if (accumulated !== 0 && Math.sign(delta) !== Math.sign(accumulated)) {
        accumulated = 0;
      }

      const goingForward = delta > 0;
      if (!atEdge(goingForward)) {
        accumulated = 0; // still scrollable, so leave the panel alone
        return;
      }

      accumulated += delta;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      commit(goingForward, now);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }
      if (isTypingTarget(event.target) || isWithinTablist(event.target)) return;

      const goingForward = event.key === "ArrowDown";
      const goingBack = event.key === "ArrowUp";
      if (!goingForward && !goingBack) return;

      // Claimed either way, so a focused link inside the panel cannot also
      // trigger the browser's own scrolling on top of ours.
      event.preventDefault();

      if (!atEdge(goingForward)) {
        el.scrollBy({ top: goingForward ? KEY_SCROLL_STEP : -KEY_SCROLL_STEP });
        return;
      }

      // A held arrow repeats ~30x a second, so throttle repeats to one tab per
      // cooldown while leaving deliberate presses instant.
      const now = performance.now();
      if (event.repeat && now < lockedUntil) return;

      commit(goingForward, now);
    };

    let touchStartY = 0;
    let touchHandled = false;

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchHandled = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchHandled) return;
      const now = performance.now();
      if (now < lockedUntil) return;

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - currentY; // swipe up => move forward
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;

      const goingForward = delta > 0;
      if (!atEdge(goingForward)) return;

      touchHandled = true; // one tab change per swipe
      commit(goingForward, now);
    };

    // Passive where we never call preventDefault: we only observe and hand off.
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    // Arrows are global: the scroll container is not focusable, so waiting for
    // focus to land inside it would mean the keys mostly did nothing.
    window.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [containerRef, enabled]);
}
