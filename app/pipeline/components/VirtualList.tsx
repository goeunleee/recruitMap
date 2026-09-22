"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export function VirtualList<T extends { id: string }>({
  items,
  itemSize,
  children,
}: {
  items: T[];
  itemSize: (item: T) => number;
  children: (item: T) => ReactNode;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setHeight(el.clientHeight);
    });
    observer.observe(el);
    setHeight(el.clientHeight);
    return () => observer.disconnect();
  }, []);

  const { offsets, total } = useMemo(() => {
    const nextOffsets: number[] = [];
    let acc = 0;
    for (const item of items) {
      nextOffsets.push(acc);
      acc += itemSize(item);
    }
    return { offsets: nextOffsets, total: acc };
  }, [items, itemSize]);

  const overscan = 4;
  let start = 0;
  while (
    start < items.length &&
    offsets[start] + itemSize(items[start]) < scrollTop
  ) {
    start += 1;
  }
  start = Math.max(0, start - overscan);
  let end = start;
  while (end < items.length && offsets[end] < scrollTop + height) {
    end += 1;
  }
  end = Math.min(items.length, end + overscan);

  return (
    <div
      ref={parentRef}
      className="min-h-0 flex-1 overflow-y-auto p-3 pt-0"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div className="relative" style={{ height: total }}>
        {items.slice(start, end).map((item, index) => (
          <div
            key={item.id}
            className="absolute right-0 left-0"
            style={{ top: offsets[start + index] }}
          >
            {children(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
