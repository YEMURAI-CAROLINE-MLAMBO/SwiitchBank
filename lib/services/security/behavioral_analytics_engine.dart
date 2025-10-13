// lib/services/security/behavioral_analytics_engine.dart
import 'dart:math';
import 'package:swiitch/core/models/advanced_security_models.dart';
import 'package:swiitch/core/security/security_constants.dart';


/// 🧠 Advanced Behavioral Analytics Engine
/// AI-powered pattern recognition and anomaly detection
class BehavioralAnalyticsEngine {
  static final Map<String, UserBehaviorProfile> _userProfiles = {};
  static final Map<String, List<SecurityEvent>> _anomalyHistory = {};

  /// Initialize behavioral profile for user
  static Future<void> initializeUserProfile(String userId) async {
    _userProfiles[userId] = UserBehaviorProfile(
      userId: userId,
      transactionPatterns: TransactionPatterns(),
      loginPatterns: LoginPatterns(),
      deviceUsage: DeviceUsagePatterns(),
      geographicPatterns: GeographicPatterns(),
      spendingHabits: SpendingHabits(),
      riskScore: 0.5, // Neutral starting point
      profileStrength: 0.0,
      lastUpdated: DateTime.now(),
    );

    _anomalyHistory[userId] = [];

    print('✅ Behavioral profile initialized for user: $userId');
  }

  /// Analyze transaction for behavioral anomalies
  static Future<BehavioralAnalysisResult> analyzeTransaction({
    required String userId,
    required Map<String, dynamic> transaction,
    required UserContext context,
  }) async {
    final profile = _userProfiles[userId];
    if (profile == null) {
      return BehavioralAnalysisResult.noProfile();
    }

    final analysis = BehavioralAnalysisResult();

    // 1. Amount Pattern Analysis
    analysis.amountAnomaly = await _analyzeAmountPattern(profile, transaction);

    // 2. Time Pattern Analysis
    analysis.timeAnomaly = await _analyzeTimePattern(profile, transaction);

    // 3. Category Pattern Analysis
    analysis.categoryAnomaly = await _analyzeCategoryPattern(profile, transaction);

    // 4. Location Pattern Analysis
    analysis.locationAnomaly = await _analyzeLocationPattern(profile, transaction, context);

    // 5. Behavioral Sequence Analysis
    analysis.sequenceAnomaly = await _analyzeBehavioralSequence(profile, transaction, context);

    // Calculate overall risk score
    analysis.overallRiskScore = _calculateOverallRiskScore(analysis);

    // Update user profile with new data
    await _updateUserProfile(profile, transaction, analysis);

    return analysis;
  }

  /// Detect behavioral drift over time
  static Future<BehavioralDriftAnalysis> analyzeBehavioralDrift(String userId) async {
    final profile = _userProfiles[userId];
    if (profile == null) {
      return BehavioralDriftAnalysis.noData();
    }

    final recentEvents = _getRecentUserEvents(userId);
    final historicalPatterns = _getHistoricalPatterns(userId);

    return BehavioralDriftAnalysis(
      userId: userId,
      driftScore: _calculateDriftScore(recentEvents, historicalPatterns),
      changingPatterns: _identifyChangingPatterns(recentEvents, historicalPatterns),
      confidence: _calculateDriftConfidence(profile),
      recommendations: _generateDriftRecommendations(profile),
    );
  }

  // ========== PRIVATE ANALYSIS METHODS ========== //

  static Future<AnomalyScore> _analyzeAmountPattern(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction
  ) async {
    final amount = (transaction['amount'] as double?)?.abs() ?? 0.0;
    final category = transaction['category'] as String? ?? 'unknown';

    final typicalAmounts = profile.spendingHabits.typicalAmounts[category] ?? [];
    if (typicalAmounts.isEmpty) {
      return AnomalyScore(score: 0.3, confidence: 0.5); // Low confidence for new categories
    }

    final mean = _calculateMean(typicalAmounts);
    final stdDev = _calculateStandardDeviation(typicalAmounts);
    final zScore = (amount - mean) / (stdDev == 0 ? 1 : stdDev);

    return AnomalyScore(
      score: _zScoreToAnomalyScore(zScore.abs()),
      confidence: _calculatePatternConfidence(typicalAmounts.length),
    );
  }

  static Future<AnomalyScore> _analyzeTimePattern(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction
  ) async {
    final transactionTime = DateTime.parse(transaction['timestamp']);
    final hour = transactionTime.hour;
    final dayOfWeek = transactionTime.weekday;

    final typicalHours = profile.transactionPatterns.typicalHours[dayOfWeek] ?? [];
    if (typicalHours.isEmpty) {
      return AnomalyScore(score: 0.2, confidence: 0.3);
    }

    final isTypicalTime = typicalHours.contains(hour);
    final timeDeviation = _calculateTimeDeviation(hour, typicalHours);

    return AnomalyScore(
      score: isTypicalTime ? 0.1 : timeDeviation,
      confidence: _calculatePatternConfidence(typicalHours.length),
    );
  }

  static Future<AnomalyScore> _analyzeCategoryPattern(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction
  ) async {
    final category = transaction['category'] as String? ?? 'unknown';
    final userCategories = profile.spendingHabits.categoryFrequencies.keys.toList();

    if (userCategories.isEmpty || userCategories.contains(category)) {
      return AnomalyScore(score: 0.1, confidence: 0.8);
    }

    // New category detection
    return AnomalyScore(
      score: 0.6, // Moderate anomaly for new categories
      confidence: 0.7,
      metadata: {'new_category': category},
    );
  }

  static Future<AnomalyScore> _analyzeLocationPattern(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction,
    UserContext context
  ) async {
    final transactionLocation = transaction['location'] as String?;
    final userLocation = context.currentLocation;

    if (transactionLocation == null || userLocation == null) {
      return AnomalyScore(score: 0.1, confidence: 0.1);
    }

    final commonLocations = profile.geographicPatterns.commonLocations;
    final isKnownLocation = commonLocations.contains(transactionLocation);

    if (isKnownLocation) {
      return AnomalyScore(score: 0.1, confidence: 0.9);
    }

    // Check for impossible travel
    final lastLocation = profile.geographicPatterns.lastKnownLocation;
    final timeDiff = _calculateTimeDifference(transaction['timestamp'], lastLocation?.timestamp);

    if (lastLocation != null && timeDiff.inHours < SecurityConstants.geographicAnomalyTimeWindow) {
      final distance = _calculateDistance(
        lastLocation,
        _parseLocationCoordinates(transactionLocation)
      );
      final speed = distance / timeDiff.inHours;

      if (speed > SecurityConstants.impossibleTravelThresholdKm) {
        return AnomalyScore(
          score: 0.9, // High anomaly for impossible travel
          confidence: 0.85,
          metadata: {
            'speed_kmh': speed,
            'distance_km': distance,
            'time_hours': timeDiff.inHours,
          },
        );
      }
    }

    return AnomalyScore(
      score: 0.4, // Moderate anomaly for new location
      confidence: 0.6,
    );
  }

  static Future<AnomalyScore> _analyzeBehavioralSequence(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction,
    UserContext context
  ) async {
    // Analyze sequence of user actions leading to transaction
    final recentActions = context.recentUserActions;
    final typicalSequences = profile.transactionPatterns.commonSequences;

    final sequenceMatch = _findSequenceMatch(recentActions, typicalSequences);

    return AnomalyScore(
      score: sequenceMatch == null ? 0.7 : 0.1,
      confidence: 0.8,
      metadata: {'sequence_match': sequenceMatch},
    );
  }

  // ========== HELPER METHODS ========== //

  static double _zScoreToAnomalyScore(double zScore) {
    // Convert statistical z-score to 0-1 anomaly score
    if (zScore < 1.0) return 0.1;
    if (zScore < 2.0) return 0.3;
    if (zScore < 3.0) return 0.7;
    return 0.9;
  }

  static double _calculatePatternConfidence(int dataPoints) {
    // More data points = higher confidence
    return dataPoints / (dataPoints + 10).clamp(0.1, 1.0);
  }

  static double _calculateTimeDeviation(int hour, List<int> typicalHours) {
    if (typicalHours.isEmpty) return 0.5;

    final closestTypical = typicalHours.reduce((a, b) =>
      (a - hour).abs() < (b - hour).abs() ? a : b
    );

    final deviation = (hour - closestTypical).abs();
    return deviation / 12.0; // Normalize to 0-1
  }

  static double _calculateOverallRiskScore(BehavioralAnalysisResult analysis) {
    // Weighted average of all anomaly scores
    final weights = {
      'amount': 0.3,
      'time': 0.2,
      'category': 0.15,
      'location': 0.25,
      'sequence': 0.1,
    };

    double weightedSum = 0.0;
    double totalWeight = 0.0;

    if (analysis.amountAnomaly.confidence > 0.5) {
      weightedSum += analysis.amountAnomaly.score * weights['amount']!;
      totalWeight += weights['amount']!;
    }

    if (analysis.timeAnomaly.confidence > 0.5) {
      weightedSum += analysis.timeAnomaly.score * weights['time']!;
      totalWeight += weights['time']!;
    }

    if (analysis.categoryAnomaly.confidence > 0.5) {
      weightedSum += analysis.categoryAnomaly.score * weights['category']!;
      totalWeight += weights['category']!;
    }

    if (analysis.locationAnomaly.confidence > 0.5) {
      weightedSum += analysis.locationAnomaly.score * weights['location']!;
      totalWeight += weights['location']!;
    }

    if (analysis.sequenceAnomaly.confidence > 0.5) {
      weightedSum += analysis.sequenceAnomaly.score * weights['sequence']!;
      totalWeight += weights['sequence']!;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0.0;
  }

  // ========== MATHEMATICAL HELPERS ========== //

  static double _calculateMean(List<double> numbers) {
    if (numbers.isEmpty) return 0.0;
    return numbers.reduce((a, b) => a + b) / numbers.length;
  }

  static double _calculateStandardDeviation(List<double> numbers) {
    if (numbers.isEmpty) return 0.0;
    final mean = _calculateMean(numbers);
    final variance = numbers.map((x) => pow(x - mean, 2)).reduce((a, b) => a + b) / numbers.length;
    return sqrt(variance);
  }

  static double _calculateDistance(Location a, Location b) {
    // Simplified distance calculation (Haversine would be better)
    return sqrt(pow(a.lat - b.lat, 2) + pow(a.lng - b.lng, 2)) * 111; // Rough km conversion
  }

  static Duration _calculateTimeDifference(String timeA, String? timeB) {
    if (timeB == null) return Duration(hours: 24);
    final a = DateTime.parse(timeA);
    final b = DateTime.parse(timeB);
    return a.difference(b).abs();
  }

  // ========== MOCK DATA METHODS ========== //

  static List<UserAction> _getRecentUserEvents(String userId) {
    // In a real implementation, this would fetch from a database or event stream.
    // For now, returning a mock list of recent actions.
    return [
      UserAction(type: 'login', timestamp: DateTime.now().subtract(Duration(hours: 1))),
      UserAction(type: 'view_balance', timestamp: DateTime.now().subtract(Duration(minutes: 30))),
      UserAction(type: 'initiate_transfer', timestamp: DateTime.now().subtract(Duration(minutes: 5))),
    ];
  }

  static List<BehaviorPattern> _getHistoricalPatterns(String userId) {
    // In a real implementation, this would fetch from a pre-computed analytics store.
    // For now, returning a mock list of historical patterns.
    return [
      BehaviorPattern(type: 'spending_category', value: 'groceries', confidence: 0.8),
      BehaviorPattern(type: 'transaction_hour', value: '18', confidence: 0.7),
      BehaviorPattern(type: 'login_location', value: 'New York, NY', confidence: 0.9),
    ];
  }

  static double _calculateDriftScore(List<UserAction> recent, List<BehaviorPattern> historical) {
    // A simple drift calculation: Compare recent actions to historical patterns.
    if (historical.isEmpty) return 0.0;

    double mismatches = 0;
    for (final action in recent) {
      final matches = historical.where((pattern) =>
        pattern.type == action.type && pattern.value == action.metadata.toString()
      ).length;
      if (matches == 0) {
        mismatches++;
      }
    }
    return mismatches / recent.length;
  }

  static List<String> _identifyChangingPatterns(List<UserAction> recent, List<BehaviorPattern> historical) {
    final changing = <String>{};
    for (final action in recent) {
      final hasMatchingPattern = historical.any(
        (p) => p.type == action.type && p.value == action.metadata.toString()
      );
      if (!hasMatchingPattern) {
        changing.add(action.type);
      }
    }
    return changing.toList();
  }

  static double _calculateDriftConfidence(UserBehaviorProfile profile) {
    return profile.profileStrength;
  }

  static List<String> _generateDriftRecommendations(UserBehaviorProfile profile) {
    if (profile.riskScore > 0.7) {
      return ['High risk detected. Consider temporary transaction limits.', 'Review recent high-risk activities.'];
    }
    if (profile.profileStrength < 0.3) {
      return ['Behavioral profile is still learning. Continue normal activity to strengthen it.'];
    }
    return ['Behavioral patterns appear stable. No immediate action recommended.'];
  }

  static SequenceMatch? _findSequenceMatch(List<UserAction> actions, List<BehaviorSequence> sequences) {
    // Simple sequence matching: Check if the end of the recent actions list
    // matches any known common sequence.
    for (final sequence in sequences) {
      if (actions.length >= sequence.actions.length) {
        final sublist = actions.sublist(actions.length - sequence.actions.length);
        bool match = true;
        for (int i = 0; i < sublist.length; i++) {
          if (sublist[i].type != sequence.actions[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return SequenceMatch(sequenceId: sequence.id, confidence: 0.9);
        }
      }
    }
    return null;
  }

  static Location _parseLocationCoordinates(String location) {
    // Basic parsing for "lat,lng" format.
    try {
      final parts = location.split(',');
      if (parts.length == 2) {
        return Location(lat: double.parse(parts[0]), lng: double.parse(parts[1]));
      }
    } catch (e) {
      // Fallback for invalid format
      return Location(lat: 0.0, lng: 0.0);
    }
    // Fallback for other formats
    return Location(lat: 0.0, lng: 0.0);
  }

  static Future<void> _updateUserProfile(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction,
    BehavioralAnalysisResult analysis
  ) async {
    // This is a critical function that would update the user's profile
    // in a database based on the new transaction and analysis.
    // For this mock implementation, we'll just update a few fields in memory.
    final amount = (transaction['amount'] as double?)?.abs() ?? 0.0;
    final category = transaction['category'] as String? ?? 'unknown';

    // Update spending habits
    profile.spendingHabits.typicalAmounts[category] =
        (profile.spendingHabits.typicalAmounts[category] ?? [])..add(amount);

    // Update location data
    if (transaction['location'] != null) {
      profile.geographicPatterns.lastKnownLocation = Location(
        lat: _parseLocationCoordinates(transaction['location']).lat,
        lng: _parseLocationCoordinates(transaction['location']).lng,
        timestamp: transaction['timestamp'],
      );
    }

    // Update risk score (e.g., moving average)
    profile.riskScore = (profile.riskScore * 0.9) + (analysis.overallRiskScore * 0.1);

    // Strengthen profile with more data
    profile.profileStrength = (profile.profileStrength + 0.01).clamp(0.0, 1.0);

    profile.lastUpdated = DateTime.now();
  }
}
