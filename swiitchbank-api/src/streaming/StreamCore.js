import CircularBuffer from '../memory/CircularBuffer.js';

class StreamCore {
  constructor() {
    if (StreamCore.instance) {
      return StreamCore.instance;
    }
    this.streams = new Map();
    this.connections = new Map();
    StreamCore.instance = this;
  }

  _generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  createStream(userId, type) {
    const stream = {
      id: this._generateId(),
      userId,
      type,
      connections: new Set(),
      buffer: new CircularBuffer(500),
      createdAt: Date.now()
    };
    this.streams.set(stream.id, stream);
    console.log(`Stream created: ${stream.id} for user ${userId} of type ${type}`);
    return stream;
  }

  getOrCreateStream(userId, type) {
    for (const stream of this.streams.values()) {
        if (stream.userId === userId && stream.type === type) {
            return stream;
        }
    }
    return this.createStream(userId, type);
  }

  broadcast(streamId, data) {
    const stream = this.streams.get(streamId);
    if (!stream) {
      console.error(`Stream ${streamId} not found for broadcast.`);
      return;
    }

    stream.buffer.push(data);
    stream.connections.forEach(ws => {
      if (ws.readyState === 1) { // 1 means OPEN
        ws.send(JSON.stringify(data));
      }
    });
  }
}

// Export a singleton instance
export default new StreamCore();