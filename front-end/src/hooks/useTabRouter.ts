import { useCallback, useEffect, useRef, useState } from "react";

/** Direction of the last tab change; drives the enter/exit animation. */
export type NavDirection = 1 | -1;

export interface TabRouter {
  activeId: string;
  activeIndex: number;
  direction: NavDirection;
  /** Select by id. Returns true if the active tab actually changed. */
  select: (id: string) => boolean;
  /** Select by position, clamped to range. Returns true if it changed. */
  goToIndex: (index: number) => boolean;
  /** Returns false at the last tab, which lets the caller fall back to scrolling. */
  next: () => boolean;
  /** Returns false at the first tab. */
  prev: () => boolean;
}

const stripHash = (raw: string) => raw.replace(/^#\/?/, "");

function readHash(ids: readonly string[], fallback: string): string {
  const id = stripHash(window.location.hash);
  return ids.includes(id) ? id : fallback;
}

/**
 * Owns "which tab is active" and keeps it in sync with the URL fragment, so
 * every tab is deep-linkable (`/#projects`) and the browser's back/forward
 * buttons walk the tab history.
 *
 * `ids` must be referentially stable, so pass a module-level constant.
 */
export function useTabRouter(ids: readonly string[]): TabRouter {
  const [activeId, setActiveId] = useState(() => readHash(ids, ids[0]));
  const [direction, setDirection] = useState<NavDirection>(1);

  const activeIndex = Math.max(0, ids.indexOf(activeId));

  // Mirror of `activeIndex` for listeners that must not re-subscribe on every
  // render. Written after render (never during it) and also updated eagerly by
  // the navigation callbacks below, so it is correct even when two of them fire
  // before React commits.
  const indexRef = useRef(activeIndex);
  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  // Last value written to (or read from) the URL, so we never push a history
  // entry for a change the URL already reflects.
  const syncedRef = useRef(activeId);

  const goToIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), ids.length - 1);
      if (clamped === indexRef.current) return false;

      setDirection(clamped > indexRef.current ? 1 : -1);
      setActiveId(ids[clamped]);
      indexRef.current = clamped; // keep rapid successive calls consistent
      return true;
    },
    [ids],
  );

  const select = useCallback(
    (id: string) => {
      const index = ids.indexOf(id);
      return index === -1 ? false : goToIndex(index);
    },
    [ids, goToIndex],
  );

  const next = useCallback(
    () => goToIndex(indexRef.current + 1),
    [goToIndex],
  );
  const prev = useCallback(
    () => goToIndex(indexRef.current - 1),
    [goToIndex],
  );

  // URL -> state (back/forward buttons, manual edits, shared links).
  useEffect(() => {
    const sync = () => {
      const id = readHash(ids, ids[0]);
      const index = ids.indexOf(id);
      if (index === indexRef.current) return;

      syncedRef.current = id; // suppress the echo push below
      setDirection(index > indexRef.current ? 1 : -1);
      setActiveId(id);
      indexRef.current = index;
    };

    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [ids]);

  // state -> URL. Guarded by a ref rather than a mount flag so React's
  // StrictMode double-invocation stays a no-op and the initial load leaves a
  // clean URL.
  useEffect(() => {
    if (syncedRef.current === activeId) return;
    syncedRef.current = activeId;
    window.history.pushState(null, "", `#${activeId}`);
  }, [activeId]);

  return { activeId, activeIndex, direction, select, goToIndex, next, prev };
}
