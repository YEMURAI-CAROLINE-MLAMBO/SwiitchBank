const monitoring = {
  // Track response times
  responseTimes: new Map(),

  // Monitor memory usage
  trackMemory: () => {
    const used = process.memoryUsage();
    console.log(`Memory - RSS: ${Math.round(used.rss / 1024 / 1024)}MB,
                Heap: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  },

  // API performance tracking
  trackEndpointPerformance: (endpoint, startTime) => {
    const duration = Date.now() - startTime;
    const current = monitoring.responseTimes.get(endpoint) || { count: 0, total: 0 };

    monitoring.responseTimes.set(endpoint, {
      count: current.count + 1,
      total: current.total + duration,
      average: (current.total + duration) / (current.count + 1)
    });

    // Log slow endpoints
    if (duration > 1000) { // 1 second
      console.warn(`Slow endpoint: ${endpoint} took ${duration}ms`);
    }
  },

  // Database query monitoring
  trackQueryPerformance: (collection, operation, duration) => {
    if (duration > 100) { // 100ms
      console.warn(`Slow query: ${collection}.${operation} took ${duration}ms`);
    }
  }
};

// Export monitoring middleware
export default (req, res, next) => {
  const startTime = Date.now();

  // Track when response finishes
  res.on('finish', () => {
    monitoring.trackEndpointPerformance(req.path, startTime);
  });

  next();
};
