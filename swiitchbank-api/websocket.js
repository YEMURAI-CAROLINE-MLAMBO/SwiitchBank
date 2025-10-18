import { WebSocketServer } from 'ws';
import { URL } from 'url';
import WebSocketManager from './src/streaming/WebSocketManager.js';
import StreamServices from './src/streaming/StreamServices.js';

function startWebSocketServer(server) {
  const wss = new WebSocketServer({ server }); // Attach to existing HTTP server

  wss.on('connection', (ws, req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        console.log('Connection attempt without userId. Closing.');
        ws.close();
        return;
      }

      const connId = WebSocketManager.addConnection(ws, userId);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          console.log(`Received message from ${connId}:`, message);

          if (message.type === 'SUBSCRIBE' && Array.isArray(message.streams)) {
            message.streams.forEach(streamType => {
              WebSocketManager.subscribe(connId, streamType);
              // Also initialize the server-side stream logic for this user
              if(streamType === 'transactions') StreamServices.streamTransactions(userId);
              if(streamType === 'market_data') StreamServices.streamMarketData(userId);
              if(streamType === 'ai_insights') StreamServices.streamAIInsights(userId);
            });
          }
        } catch (e) {
            console.error(`Failed to process message from ${connId}:`, data.toString(), e);
        }
      });

      ws.on('close', () => {
        console.log(`WebSocket connection closed for user: ${userId}`);
      });

    } catch (e) {
        console.error("Error during WebSocket connection setup:", e);
        ws.close();
    }
  });

  console.log('WebSocket server is set up and listening.');
  return wss;
}

export default startWebSocketServer;