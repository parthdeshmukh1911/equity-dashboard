import { useLayoutEffect, useRef } from 'react';

// Route components are unmounted during navigation. Keep their scroll offsets
// outside React so returning to a page restores the user's previous position.
const scrollPositions = new Map();

export default function usePageScrollRestoration(pageKey) {
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;

    element.scrollTop = scrollPositions.get(pageKey) ?? 0;

    return () => {
      scrollPositions.set(pageKey, element.scrollTop);
    };
  }, [pageKey]);

  return scrollRef;
}
