class CircularBuffer {
  constructor(capacity) {
    this.buffer = new Array(capacity);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this.size = 0;
  }

  push(item) {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    if (this.size === this.capacity) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this.size++;
    }
  }

  getRecent(count) {
    const result = [];
    let current = this.tail;
    const numItems = Math.min(count, this.size);

    for (let i = 0; i < numItems; i++) {
      current = (current - 1 + this.capacity) % this.capacity;
      result.unshift(this.buffer[current]);
    }
    return result;
  }
}

export default CircularBuffer;