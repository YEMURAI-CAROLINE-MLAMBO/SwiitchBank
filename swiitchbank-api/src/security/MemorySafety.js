class MemorySafety {
  static initMonitoring() {
    setInterval(() => {
      const memory = process.memoryUsage();
      const usedMB = memory.heapUsed / 1024 / 1024;
      const limitMB = 512; // 512MB limit

      if (usedMB > limitMB * 0.8) {
        this.triggerCleanup();
      }
    }, 30000);
  }

  static triggerCleanup() {
    if (global.gc) {
      global.gc();
      console.log("Garbage collection triggered.");
    }
    // The require.cache logic is removed as it's not compatible with ESM.
    // A more robust cache-clearing mechanism would need to be implemented
    // if modules with a clearCache method are used.
  }
}

export default MemorySafety;
