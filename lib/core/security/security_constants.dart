// lib/core/security/security_constants.dart
import 'package:swiitch/core/models/advanced_security_models.dart';

/// 🔐 Security Configuration Constants
class SecurityConstants {
  // Encryption & Hashing
  static const String encryptionAlgorithm = 'AES-256-GCM';
  static const int encryptionKeyLength = 32;
  static const int saltRounds = 12;

  // Session Security
  static const Duration sessionTimeout = Duration(minutes: 30);
  static const Duration authTokenLifetime = Duration(hours: 24);
  static const int maxLoginAttempts = 5;
  static const Duration loginLockoutDuration = Duration(minutes: 15);

  // Transaction Security Thresholds
  static const double largeTransactionThreshold = 10000.00;
  static const double unusualAmountDeviation = 2.5; // Standard deviations
  static const int maxDailyTransactionCount = 50;
  static const double maxDailyTransactionVolume = 50000.00;

  // Behavioral Analysis
  static const int behaviorHistoryDays = 90;
  static const double anomalyConfidenceThreshold = 0.75;
  static const int minDataPointsForAnalysis = 10;

  // Geographic Security
  static const double impossibleTravelThresholdKm = 800.0; // km/h
  static const int geographicAnomalyTimeWindow = 2; // hours

  // Device Security
  static const int maxTrustedDevices = 5;
  static const Duration deviceFingerprintExpiry = Duration(days: 90);

  // API Security
  static const Duration apiRateLimitWindow = Duration(minutes: 1);
  static const int maxApiRequestsPerMinute = 60;
  static const int maxConcurrentSessions = 3;

  // Notification Preferences
  static const bool enablePushNotifications = true;
  static const bool enableEmailAlerts = true;
  static const bool enableSmsAlerts = false;
}

/// 🚨 Threat Level Definitions
class ThreatLevels {
  static const Map<ThreatLevel, Map<String, dynamic>> definitions = {
    ThreatLevel.low: {
      'name': 'Low',
      'color': 0xFF4CAF50, // Green
      'action': 'log_only',
      'notification': 'none',
      'auto_response': false,
    },
    ThreatLevel.medium: {
      'name': 'Medium',
      'color': 0xFFFFC107, // Amber
      'action': 'notify_user',
      'notification': 'push',
      'auto_response': false,
    },
    ThreatLevel.high: {
      'name': 'High',
      'color': 0xFFFF9800, // Orange
      'action': 'require_verification',
      'notification': 'push_and_email',
      'auto_response': true,
    },
    ThreatLevel.critical: {
      'name': 'Critical',
      'color': 0xFFF44336, // Red
      'action': 'restrict_account',
      'notification': 'all_channels',
      'auto_response': true,
    },
  };
}

/// 📊 Security Event Types
class SecurityEventTypes {
  static const Map<AnomalyType, Map<String, dynamic>> eventConfigs = {
    AnomalyType.unusualTransactionAmount: {
      'name': 'Unusual Transaction Amount',
      'defaultThreatLevel': ThreatLevel.medium,
      'requiresReview': true,
      'aiAnalysis': true,
    },
    AnomalyType.unusualTransactionTime: {
      'name': 'Unusual Transaction Time',
      'defaultThreatLevel': ThreatLevel.low,
      'requiresReview': false,
      'aiAnalysis': true,
    },
    AnomalyType.newDeviceLogin: {
      'name': 'New Device Login',
      'defaultThreatLevel': ThreatLevel.medium,
      'requiresReview': true,
      'aiAnalysis': false,
    },
    AnomalyType.geographicImpossibility: {
      'name': 'Geographic Impossibility',
      'defaultThreatLevel': ThreatLevel.high,
      'requiresReview': true,
      'aiAnalysis': true,
    },
    AnomalyType.velocityAnomaly: {
      'name': 'Transaction Velocity Anomaly',
      'defaultThreatLevel': ThreatLevel.high,
      'requiresReview': true,
      'aiAnalysis': true,
    },
    AnomalyType.behavioralDeviation: {
      'name': 'Behavioral Deviation',
      'defaultThreatLevel': ThreatLevel.medium,
      'requiresReview': true,
      'aiAnalysis': true,
    },
  };
}
