class MemoryCore {
  constructor(maxMemory = 512 * 1024 * 1024) {
    this.cache = new Map();
    this.maxMemory = maxMemory;
    this.usedMemory = 0;
  }

  // Smart caching with TTL
  set(key, value, ttl = 300000) {
    const item = { value, expires: Date.now() + ttl, size: this._sizeOf(value) };

    // Evict if needed
    if (this.usedMemory + item.size > this.maxMemory) {
      this._evictLRU();
    }

    this.cache.set(key, item);
    this.usedMemory += item.size;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expires) {
      this._remove(key);
      return null;
    }
    return item.value;
  }

  _remove(key) {
    const item = this.cache.get(key);
    if (item) {
      this.usedMemory -= item.size;
      this.cache.delete(key);
    }
  }

  // LRU eviction
  _evictLRU() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].expires - b[1].expires);

    const toRemove = entries.slice(0, Math.floor(entries.length * 0.2));
    toRemove.forEach(([key]) => this._remove(key));
  }

  _sizeOf(value) {
    // A more accurate size calculation would be needed for production
    return JSON.stringify(value).length;
  }
}

export default MemoryCore;