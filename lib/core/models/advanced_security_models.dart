// lib/core/models/advanced_security_models.dart

import 'dart:math';

/// Advanced behavioral analysis result
class BehavioralAnalysisResult {
  AnomalyScore amountAnomaly;
  AnomalyScore timeAnomaly;
  AnomalyScore categoryAnomaly;
  AnomalyScore locationAnomaly;
  AnomalyScore sequenceAnomaly;
  double overallRiskScore;
  List<SecurityRecommendation> recommendations;

  BehavioralAnalysisResult({
    this.amountAnomaly = const AnomalyScore(),
    this.timeAnomaly = const AnomalyScore(),
    this.categoryAnomaly = const AnomalyScore(),
    this.locationAnomaly = const AnomalyScore(),
    this.sequenceAnomaly = const AnomalyScore(),
    this.overallRiskScore = 0.0,
    this.recommendations = const [],
  });

  factory BehavioralAnalysisResult.noProfile() {
    return BehavioralAnalysisResult(
      overallRiskScore: 0.5,
      recommendations: [SecurityRecommendation.incompleteProfile()],
    );
  }

  bool get hasSignificantAnomaly => overallRiskScore > 0.7;
}

/// Anomaly scoring
class AnomalyScore {
  final double score; // 0.0 - 1.0
  final double confidence; // 0.0 - 1.0
  final Map<String, dynamic> metadata;

  const AnomalyScore({
    this.score = 0.0,
    this.confidence = 0.0,
    this.metadata = const {},
  });

  bool get isSignificant => score > 0.7 && confidence > 0.6;
}

/// User behavior profile
class UserBehaviorProfile {
  final String userId;
  TransactionPatterns transactionPatterns;
  LoginPatterns loginPatterns;
  DeviceUsagePatterns deviceUsage;
  GeographicPatterns geographicPatterns;
  SpendingHabits spendingHabits;
  double riskScore;
  double profileStrength;
  DateTime lastUpdated;

  UserBehaviorProfile({
    required this.userId,
    required this.transactionPatterns,
    required this.loginPatterns,
    required this.deviceUsage,
    required this.geographicPatterns,
    required this.spendingHabits,
    required this.riskScore,
    required this.profileStrength,
    required this.lastUpdated,
  });
}

/// Behavioral drift analysis
class BehavioralDriftAnalysis {
  final String userId;
  final double driftScore;
  final List<String> changingPatterns;
  final double confidence;
  final List<String> recommendations;

  BehavioralDriftAnalysis({
    required this.userId,
    required this.driftScore,
    required this.changingPatterns,
    required this.confidence,
    required this.recommendations,
  });

  factory BehavioralDriftAnalysis.noData() {
    return BehavioralDriftAnalysis(
      userId: '',
      driftScore: 0.0,
      changingPatterns: [],
      confidence: 0.0,
      recommendations: ['Insufficient data for drift analysis'],
    );
  }
}

/// Supporting data structures
class TransactionPatterns {
  Map<int, List<int>> typicalHours = {}; // dayOfWeek -> list of hours
  Map<String, List<double>> amountDistributions = {};
  List<BehaviorSequence> commonSequences = [];
}

class LoginPatterns {
  Map<String, List<int>> deviceLoginTimes = {};
  List<String> commonUserAgents = [];
  List<String> trustedNetworks = [];
}

class DeviceUsagePatterns {
  Map<String, int> appUsageFrequency = {};
  List<String> typicalUsageTimes = [];
  Map<String, double> featureUsageRates = {};
}

class GeographicPatterns {
  List<String> commonLocations = [];
  Location? lastKnownLocation;
  Map<String, int> locationFrequencies = {};
}

class SpendingHabits {
  Map<String, List<double>> typicalAmounts = {};
  Map<String, int> categoryFrequencies = {};
  Map<String, double> categoryProportions = {};
}

class Location {
  final double lat;
  final double lng;
  final String? timestamp;

  const Location({required this.lat, required this.lng, this.timestamp});
}

class UserAction {
  final String type;
  final DateTime timestamp;
  final Map<String, dynamic> metadata;

  UserAction({
    required this.type,
    required this.timestamp,
    this.metadata = const {},
  });
}

// ========== PLACEHOLDER CLASSES FOR COMPILATION ========== //

class UserContext {
  final String? currentLocation;
  final List<UserAction> recentUserActions;

  UserContext({this.currentLocation, this.recentUserActions = const []});
}

class SecurityRecommendation {
  final String message;

  SecurityRecommendation(this.message);

  factory SecurityRecommendation.incompleteProfile() {
    return SecurityRecommendation("User profile is incomplete.");
  }
}

class BehaviorSequence {
  // Placeholder
}

class SequenceMatch {
  // Placeholder
}

class BehaviorPattern {
  // Placeholder
}

class SecurityEvent {
  // Placeholder
}

// ========== ENUMS FOR SECURITY FRAMEWORK ========== //

enum AnomalyType {
  unusualTransactionAmount,
  unusualTransactionTime,
  newDeviceLogin,
  geographicImpossibility,
  velocityAnomaly,
  behavioralDeviation,
}

enum ThreatLevel {
  low,
  medium,
  high,
  critical,
}
