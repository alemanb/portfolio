import { useEffect, useRef } from "react";
import { isTypingTarget } from "../lib/keyboard";

export interface TabHotkeyOptions {
  /** Ordered tab ids; digit keys map to positions in this list. */
  ids: readonly string[];
  onSelectIndex: (index: number) => boolean;
  enabled?: boolean;
}

/**
 * Jump straight to a tab with its number key.
 *
 * Stepping one tab at a time lives in `useSequentialNavigation` instead, since
 * the arrow keys share the scroll boundary rule with the wheel and need the
 * panel element to evaluate it.
 */
export function useTabHotkeys({
  ids,
  onSelectIndex,
  enabled = true,
}: TabHotkeyOptions): void {
  // Latest-callback ref, refreshed after render (never during it) so the
  // listener below can stay subscribed across re-renders.
  const handlers = useRef({ onSelectIndex });
  useEffect(() => {
    handlers.current = { onSelectIndex };
  });

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // Never shadow browser or OS shortcuts.
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (!/^[1-9]$/.test(event.key)) return;

      const index = Number(event.key) - 1;
      if (index >= ids.length) return;

      event.preventDefault();
      handlers.current.onSelectIndex(index);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ids, enabled]);
}
