import { useState, useEffect, useCallback } from 'react';

const useInfiniteScroll = (initialData = [], pageSize = 50) => {
  const [data, setData] = useState(initialData.slice(0, pageSize));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length > pageSize);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call or slice more data
    await new Promise(resolve => setTimeout(resolve, 500));

    const nextPage = page + 1;
    const startIndex = page * pageSize;
    const endIndex = nextPage * pageSize;
    const newData = initialData.slice(startIndex, endIndex);

    setData(prev => [...prev, ...newData]);
    setPage(nextPage);
    setHasMore(endIndex < initialData.length);
    setLoading(false);
  }, [page, hasMore, loading, initialData, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop
          !== document.documentElement.offsetHeight) return;
      loadMore();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return { data, loadMore, hasMore, loading };
};

export default useInfiniteScroll;
