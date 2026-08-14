import { MotionConfig } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import { BrowserFrame } from "./components/layout/BrowserFrame";
import { TabRail } from "./components/layout/TabRail";
import { TabViewport } from "./components/layout/TabViewport";
import { portfolio } from "./data/portfolio";
import { useIntroSequence } from "./hooks/useIntroSequence";
import { useSequentialNavigation } from "./hooks/useSequentialNavigation";
import { useTabHotkeys } from "./hooks/useTabHotkeys";
import { useTabRouter } from "./hooks/useTabRouter";
import { TABS, TAB_IDS, type PanelContext } from "./tabs";

export default function App() {
  const { activeId, activeIndex, direction, select, goToIndex, next, prev } =
    useTabRouter(TAB_IDS);

  /**
   * The intro phase lives here rather than inside the frame because it gates
   * more than the visuals: the panel does not exist until the sequence
   * finishes, so the input hooks must wait for it too. `enabled` flipping is
   * also what re-runs their effects once the scroll container has mounted.
   */
  const phase = useIntroSequence();
  const isReady = phase === "ready";

  // Shared with the panel so gestures are measured against the element that
  // actually scrolls.
  const viewportRef = useRef<HTMLDivElement>(null);

  // Wheel, swipe, and arrow keys all step through tabs at the panel's edges.
  useSequentialNavigation({
    containerRef: viewportRef,
    onNext: next,
    onPrev: prev,
    enabled: isReady,
  });

  // Number keys jump straight to a tab.
  useTabHotkeys({
    ids: TAB_IDS,
    onSelectIndex: goToIndex,
    enabled: isReady,
  });

  const activeTab = TABS[activeIndex];

  // Keep the real browser tab in step with the in-page one.
  useEffect(() => {
    const { name } = portfolio.profile;
    document.title = activeTab.hideHeader
      ? name
      : `${activeTab.label} · ${name}`;
  }, [activeTab]);

  const context = useMemo<PanelContext>(
    () => ({ data: portfolio, navigate: select }),
    [select],
  );

  return (
    <MotionConfig reducedMotion="user">
      <BrowserFrame path={activeId} phase={phase}>
        <TabRail tabs={TABS} activeIndex={activeIndex} onSelect={goToIndex} />
        <TabViewport
          tab={activeTab}
          index={activeIndex}
          direction={direction}
          scrollRef={viewportRef}
          context={context}
        />
      </BrowserFrame>
    </MotionConfig>
  );
}
