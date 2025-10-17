import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

class WebSocketClient {
  static final WebSocketClient _singleton = WebSocketClient._internal();
  factory WebSocketClient() => _singleton;

  WebSocketClient._internal();

  WebSocketChannel? _channel;
  bool _isConnected = false;
  final Map<String, Function(dynamic)> _handlers = {};
  VoidCallback? _onConnectionError;

  Future<void> connect(String userId, List<String> streams, {VoidCallback? onConnectionError}) async {
    if (_isConnected) {
      debugPrint('WebSocket already connected.');
      return;
    }

    _onConnectionError = onConnectionError;

    // Use the correct backend port
    final wsUrl = Uri.parse('ws://localhost:5001?userId=$userId');

    try {
      _channel = WebSocketChannel.connect(wsUrl);
      _isConnected = true;
      debugPrint('WebSocket connected to $wsUrl');

      _channel!.stream.listen(
        _handleMessage,
        onDone: () {
          _isConnected = false;
          debugPrint('WebSocket connection closed.');
          _onConnectionError?.call();
        },
        onError: (error) {
          _isConnected = false;
          debugPrint('WebSocket error: $error');
          _onConnectionError?.call();
        },
        cancelOnError: true,
      );

      // Subscribe to initial streams
      _send({'type': 'SUBSCRIBE', 'streams': streams});

    } catch (e) {
      _isConnected = false;
      debugPrint('Error connecting to WebSocket: $e');
       _onConnectionError?.call();
    }
  }

  void _handleMessage(dynamic message) {
    try {
      final data = json.decode(message);
      final type = data['type'];
      debugPrint("Received WebSocket message of type: $type");
      if (_handlers.containsKey(type)) {
        _handlers[type]!.call(data);
      } else {
        debugPrint("No handler for message type: $type");
      }
    } catch (e) {
      debugPrint('Error handling WebSocket message: $e');
    }
  }

  void on(String type, Function(dynamic) handler) {
    _handlers[type] = handler;
  }

  void _send(Map<String, dynamic> message) {
    if (_isConnected && _channel != null) {
      _channel!.sink.add(json.encode(message));
    } else {
      debugPrint('Cannot send message: WebSocket is not connected.');
    }
  }

  void dispose() {
    _channel?.sink.close(status.goingAway);
    _isConnected = false;
    _handlers.clear();
    debugPrint('WebSocket client disposed.');
  }
}