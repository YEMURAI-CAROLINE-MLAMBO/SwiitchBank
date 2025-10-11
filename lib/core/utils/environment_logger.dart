// lib/core/utils/environment_logger.dart
import 'package:flutter/foundation.dart';
import '../config/environment_manager.dart';

enum LogLevel {
  debug,
  info,
  warning,
  error,
}

class EnvironmentLogger {
  static void log(String message, {LogLevel level = LogLevel.info}) {
    final currentEnv = EnvironmentManager.currentEnv;

    // Only log based on environment
    if (_shouldLog(level, currentEnv)) {
      final formattedMessage = '[$currentEnv] $message';

      switch (level) {
        case LogLevel.debug:
          debugPrint('🐛 $formattedMessage');
        case LogLevel.warning:
          debugPrint('⚠️ $formattedMessage');
        case LogLevel.error:
          debugPrint('❌ $formattedMessage');
        default:
          debugPrint('ℹ️ $formattedMessage');
      }
    }
  }

  static bool _shouldLog(LogLevel level, String environment) {
    const levelWeights = {
      'development': 0, // Log everything
      'staging': 1,    // Log info and above
      'production': 2, // Log warnings and errors only
    };

    // The enum's index corresponds to the LogLevel.
    // debug: 0, info: 1, warning: 2, error: 3
    final levelWeight = level.index;

    // Get the minimum log level for the current environment.
    final minLogLevel = levelWeights[environment] ?? 0;

    return levelWeight >= minLogLevel;
  }
}
