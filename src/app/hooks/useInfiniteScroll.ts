import { useCallback, useEffect, useRef, useState } from 'react';

export default function useInfiniteScroll<T>(data: T[], batchSize = 5) {
  const [visibleData, setVisibleData] = useState<T[]>([]);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef<HTMLAnchorElement | null>(null);

  const loadMore = useCallback(() => {
    if (visibleCount >= data.length) return;
    setVisibleCount((prev) => Math.min(prev + batchSize, data.length));
  }, [visibleCount, data.length, batchSize]);

  useEffect(() => {
    setVisibleData(data.slice(0, visibleCount));
  }, [data, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('intersecting');
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore]);

  return {
    visibleData,
    loaderRef,
    hasMore: visibleCount < data.length,
    loadMore,
  };
}
