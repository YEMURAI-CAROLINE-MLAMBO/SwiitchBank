import 'dart:async';
import 'package:flutter/foundation.dart';
import '../services/websocket_client.dart';

class StreamManager {
  final Map<String, StreamController<dynamic>> _controllers = {};
  final WebSocketClient _wsClient = WebSocketClient();

  // Ensure a single instance of StreamManager
  static final StreamManager _singleton = StreamManager._internal();
  factory StreamManager() => _singleton;
  StreamManager._internal();

  Stream<dynamic> getStream(String type) {
    // Return an existing stream or create a new one if it doesn't exist.
    return _controllers.putIfAbsent(type, () => StreamController.broadcast()).stream;
  }

  void handleMessage(Map<String, dynamic> data) {
    final type = data['type'];
    if (type != null && _controllers.containsKey(type)) {
      _controllers[type]!.add(data);
    } else {
      debugPrint("StreamManager: No active stream for type $type");
    }
  }

  // Convenience method to set up listeners on the WebSocketClient
  void initializeListeners() {
    _wsClient.on('TRANSACTION_UPDATE', handleMessage);
    _wsClient.on('MARKET_UPDATE', handleMessage);
    _wsClient.on('AI_INSIGHT', handleMessage);
    _wsClient.on('HISTORICAL_DATA', (data) {
        // Special handling for historical data to populate streams
        final streamType = data['streamType'];
        final historicalItems = data['data'] as List<dynamic>;
        for (var item in historicalItems) {
            // We need to reconstruct the original message format
            handleMessage({'type': streamType, 'data': item});
        }
    });
    debugPrint("StreamManager initialized with WebSocket listeners.");
  }

  void dispose() {
    for (var controller in _controllers.values) {
      controller.close();
    }
    _controllers.clear();
    debugPrint("All stream controllers disposed.");
  }
}