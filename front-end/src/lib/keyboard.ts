/**
 * Guards shared by the global keyboard listeners, so both hooks agree on what
 * counts as "the user is busy, keep out".
 */

/** True when the event came from somewhere the user is entering text. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/**
 * True when the event came from inside the tab rail.
 *
 * The rail implements the ARIA tablist keyboard contract itself, so a global
 * arrow-key listener has to stay out of its way or a single press would move
 * two tabs.
 */
export function isWithinTablist(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement && target.closest('[role="tablist"]') !== null
  );
}
