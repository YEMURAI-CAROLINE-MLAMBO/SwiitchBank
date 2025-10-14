// lib/services/log_service.dart

import 'dart:async';

class LogService {
  // Singleton pattern to ensure a single instance throughout the app
  static final LogService _instance = LogService._internal();
  factory LogService() {
    return _instance;
  }
  LogService._internal();

  final _logController = StreamController<String>.broadcast();
  final List<String> _logs = [];

  Stream<String> get logStream => _logController.stream;
  List<String> get logs => _logs;

  void log(String message) {
    final timestamp = DateTime.now().toIso8601String().substring(11, 23);
    final logMessage = '[$timestamp] $message';
    _logs.add(logMessage);
    _logController.add(logMessage);
    // Also print to console for debugging purposes
    print(logMessage);
  }

  void dispose() {
    _logController.close();
  }
}
