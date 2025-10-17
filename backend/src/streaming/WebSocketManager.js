import StreamCore from './StreamCore.js';

class WebSocketManager {
    constructor() {
        if (WebSocketManager.instance) {
            return WebSocketManager.instance;
        }
        this.connections = new Map();
        WebSocketManager.instance = this;
    }

    _generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    addConnection(ws, userId) {
        const connId = this._generateId();
        this.connections.set(connId, { ws, userId, connectedAt: Date.now() });
        console.log(`Connection ${connId} added for user ${userId}`);

        ws.on('close', () => {
            console.log(`Connection ${connId} closed.`);
            this.connections.delete(connId);
        });
        ws.on('error', (error) => {
            console.error(`Error on connection ${connId}:`, error);
            this.connections.delete(connId);
        });

        return connId;
    }

    subscribe(connId, streamType) {
        const conn = this.connections.get(connId);
        if (!conn) {
            console.error(`Connection ${connId} not found for subscription.`);
            return;
        }

        const stream = StreamCore.getOrCreateStream(conn.userId, streamType);
        stream.connections.add(conn.ws);
        console.log(`Connection ${connId} subscribed to stream ${stream.id} (${streamType})`);

        // Send recent buffer history on subscribe
        const recentData = stream.buffer.getRecent(50);
        if(recentData.length > 0) {
            conn.ws.send(JSON.stringify({
                type: "HISTORICAL_DATA",
                streamType: streamType,
                data: recentData
            }));
        }
    }
}

// Export a singleton instance
export default new WebSocketManager();