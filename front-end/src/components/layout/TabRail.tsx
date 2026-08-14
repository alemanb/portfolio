import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { bootItem, INDICATOR_SPRING } from "../../lib/motion";
import { cn } from "../../lib/utils";
import type { TabDefinition } from "../../tabs";

interface TabRailProps {
  tabs: readonly TabDefinition[];
  activeIndex: number;
  onSelect: (index: number) => boolean;
}

/** A tab's box, relative to the list. */
interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** The live position of the moving indicator. */
interface Pill {
  x: MotionValue<number>;
  y: MotionValue<number>;
  width: MotionValue<number>;
  height: MotionValue<number>;
}

const sameRects = (a: Rect[], b: Rect[]) =>
  a.length === b.length &&
  a.every(
    (r, i) =>
      r.top === b[i].top &&
      r.left === b[i].left &&
      r.width === b[i].width &&
      r.height === b[i].height,
  );

/**
 * How much of `rect` the indicator currently covers, 0 to 1.
 *
 * Area based rather than axis based so it works unchanged for the vertical
 * rail and the horizontal strip on narrow screens.
 */
function coverage(rect: Rect, px: number, py: number, pw: number, ph: number) {
  const area = rect.width * rect.height;
  if (area <= 0) return 0;

  const overlapX =
    Math.min(px + pw, rect.left + rect.width) - Math.max(px, rect.left);
  const overlapY =
    Math.min(py + ph, rect.top + rect.height) - Math.max(py, rect.top);

  return (Math.max(0, overlapX) * Math.max(0, overlapY)) / area;
}

/** How lit a hovered but unselected tab gets, on the same 0 to 1 scale. */
const HOVER_LIT = 0.45;

/** Quick and non-bouncy; this is feedback, not motion worth noticing. */
const HOVER_SPRING = { stiffness: 400, damping: 40 };

/** Blend between two theme colors, keeping the palette in CSS. */
const mix = (to: string, from: string) => (amount: number) =>
  `color-mix(in oklab, var(${to}) ${Math.round(amount * 100)}%, var(${from}))`;

interface RailTabProps {
  tab: TabDefinition;
  index: number;
  isActive: boolean;
  rect: Rect | undefined;
  pill: Pill;
  onSelect: (index: number) => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}

/**
 * A single tab. Its own component so each one can hold the hooks that derive
 * its color from the indicator's live position.
 */
function RailTab({
  tab,
  index,
  isActive,
  rect,
  pill,
  onSelect,
  buttonRef,
}: RailTabProps) {
  // Pointer feedback lives here too, because the colors below are inline
  // motion values that a CSS :hover rule cannot override.
  const hover = useSpring(0, HOVER_SPRING);

  // Recomputed every frame the indicator moves, so a label is lit exactly in
  // proportion to how far the indicator has actually travelled over it.
  //
  // Every motion value is read up front, never behind the `rect` check. This
  // form of useTransform discovers what to subscribe to by watching which
  // values the function reads on its first call, and on the very first render
  // `rect` is still undefined because nothing has been measured yet. Short
  // circuiting before the reads registered zero dependencies, which left every
  // label stuck at its initial color until an unrelated re-render rebuilt the
  // transform.
  const lit = useTransform(() => {
    const x = pill.x.get();
    const y = pill.y.get();
    const width = pill.width.get();
    const height = pill.height.get();
    const hovered = hover.get();

    const covered = rect ? coverage(rect, x, y, width, height) : 0;
    return Math.max(covered, hovered);
  });

  const labelColor = useTransform(lit, mix("--color-ink", "--color-faint"));
  const iconColor = useTransform(lit, mix("--color-accent", "--color-faint"));

  const Icon = tab.icon;

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={`tab-${tab.id}`}
      aria-controls={`panel-${tab.id}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(index)}
      onPointerEnter={() => hover.set(HOVER_LIT)}
      onPointerLeave={() => hover.set(0)}
      className={cn(
        // `relative` lifts the content above the indicator behind it.
        "relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5",
        "text-sm whitespace-nowrap",
        // No focus ring: selection follows focus in a tablist, so the
        // indicator already marks where the keyboard is.
        "focus-visible:outline-none",
      )}
    >
      {/* Lucide strokes with currentColor, so coloring the wrapper is enough. */}
      <motion.span style={{ color: iconColor }} className="flex shrink-0">
        <Icon className="size-4" />
      </motion.span>

      <motion.span style={{ color: labelColor }}>{tab.label}</motion.span>

      <span className="ml-auto hidden font-display text-[10px] font-semibold text-faint tabular-nums md:inline">
        {index + 1}
      </span>
    </button>
  );
}

/**
 * Chrome-style vertical tab strip (a horizontal, scrollable strip on narrow
 * screens).
 *
 * One real bordered container moves between tabs, driven by spring motion
 * values holding its position and size. Those same motion values decide each
 * label's color, so the highlight cannot arrive before or after the box that
 * causes it. Previously the two were separate animations, a ~400ms spring for
 * the box and a 200ms CSS transition for the text, which is why the color
 * looked like it landed early.
 */
export function TabRail({ tabs, activeIndex, onSelect }: TabRailProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<Rect[]>([]);

  const pill: Pill = {
    x: useSpring(0, INDICATOR_SPRING),
    y: useSpring(0, INDICATOR_SPRING),
    width: useSpring(0, INDICATOR_SPRING),
    height: useSpring(0, INDICATOR_SPRING),
  };

  const applyPill = useCallback(
    (rect: Rect, mode: "set" | "jump") => {
      pill.x[mode](rect.left);
      pill.y[mode](rect.top);
      pill.width[mode](rect.width);
      pill.height[mode](rect.height);
    },
    [pill.x, pill.y, pill.width, pill.height],
  );

  // Read inside `measure` without making the observer re-subscribe on every
  // tab change, which would turn selection moves into jumps.
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Measured from the DOM rather than derived from the index, so it holds for
  // both orientations and any label length.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const next: Rect[] = [];

      // Built by index rather than by filtering, so a momentarily detached ref
      // cannot shift every later tab's box onto the wrong tab.
      for (let index = 0; index < tabs.length; index += 1) {
        const node = buttonRefs.current[index];
        if (!node) return; // incomplete; the next measure will catch it

        next.push({
          top: node.offsetTop,
          left: node.offsetLeft,
          width: node.offsetWidth,
          height: node.offsetHeight,
        });
      }

      // Placed from this same measurement, before the state update that mounts
      // the indicator. Motion applies motion value changes on the next frame
      // rather than synchronously, so an indicator mounted while its springs
      // still read 0 paints once as a zero-sized box in the corner. Setting
      // them first means its very first paint already has real geometry.
      //
      // `jump` because this path is initial placement and layout changes
      // (resize, breakpoint flip), which should place the indicator rather than
      // fly it across the rail.
      const rect = next[activeIndexRef.current];
      if (rect) applyPill(rect, "jump");

      setRects((prev) => (sameRects(prev, next) ? prev : next));
    };

    measure();

    // Catches breakpoint flips, resizes, and late-loading webfonts.
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [tabs, applyPill]);

  // Selection changes animate. On mount this is a no-op: `rects` is still
  // empty, and once it fills the springs are already at these values.
  useLayoutEffect(() => {
    const rect = rects[activeIndex];
    if (rect) applyPill(rect, "set");
  }, [rects, activeIndex, applyPill]);

  const moveTo = (index: number) => {
    onSelect(index);
    buttonRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    let target: number;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        target = activeIndex === last ? 0 : activeIndex + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        target = activeIndex === 0 ? last : activeIndex - 1;
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    moveTo(target);
  };

  // On narrow screens the rail scrolls horizontally, so a tab reached by
  // scrolling or a hotkey could otherwise sit off-screen. A no-op on desktop.
  useLayoutEffect(() => {
    buttonRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  return (
    // `variants` with no `animate` of its own: the rail inherits the boot
    // state from the frame through context and takes its turn in the stagger.
    <motion.nav
      variants={bootItem}
      className={cn(
        "flex shrink-0 flex-col border-line bg-rail",
        "border-b md:w-56 md:border-r md:border-b-0",
      )}
    >
      {/* Padding sits on the scroller so the list box is exactly the tabs,
          which is what the indicator's offsets are measured against. */}
      <div className="overflow-x-auto p-2 scrollbar-hidden md:overflow-x-visible md:p-3">
        <div
          ref={listRef}
          role="tablist"
          aria-label="Sections"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="relative flex w-max min-w-full gap-1 md:w-full md:flex-col"
        >
          {rects.length > 0 && (
            <motion.div
              aria-hidden="true"
              style={{
                x: pill.x,
                y: pill.y,
                width: pill.width,
                height: pill.height,
              }}
              // Outline only, no fill: the text lighting up carries the
              // selection, and a filled pill on top of that was saying it
              // twice.
              className="pointer-events-none absolute top-0 left-0 rounded-lg border border-line-strong"
            />
          )}

          {tabs.map((tab, index) => (
            <RailTab
              key={tab.id}
              tab={tab}
              index={index}
              isActive={index === activeIndex}
              rect={rects[index]}
              pill={pill}
              onSelect={onSelect}
              buttonRef={(node) => {
                buttonRefs.current[index] = node;
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto hidden border-t border-line px-4 py-3 md:block">
        <p className="text-[10px] leading-relaxed text-faint">
          <span className="text-muted">scroll</span> or{" "}
          <span className="text-muted">&uarr;</span>/
          <span className="text-muted">&darr;</span> to move
          <br />
          <span className="text-muted">1</span>-
          <span className="text-muted">{tabs.length}</span> to jump
        </p>
      </div>
    </motion.nav>
  );
}
