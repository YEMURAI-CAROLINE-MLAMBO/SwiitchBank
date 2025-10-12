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
    // TODO: Implement real event tracking
    return [];
  }

  static List<BehaviorPattern> _getHistoricalPatterns(String userId) {
    // TODO: Implement pattern storage/retrieval
    return [];
  }

  static double _calculateDriftScore(List<UserAction> recent, List<BehaviorPattern> historical) {
    // TODO: Implement drift calculation
    return 0.3;
  }

  static List<String> _identifyChangingPatterns(List<UserAction> recent, List<BehaviorPattern> historical) {
    // TODO: Implement pattern change detection
    return [];
  }

  static double _calculateDriftConfidence(UserBehaviorProfile profile) {
    return profile.profileStrength;
  }

  static List<String> _generateDriftRecommendations(UserBehaviorProfile profile) {
    // TODO: Implement recommendation engine
    return ['Continue monitoring behavioral patterns'];
  }

  static SequenceMatch? _findSequenceMatch(List<UserAction> actions, List<BehaviorSequence> sequences) {
    // TODO: Implement sequence matching
    return null;
  }

  static Location _parseLocationCoordinates(String location) {
    // TODO: Implement location parsing
    return Location(lat: 0.0, lng: 0.0);
  }

  static Future<void> _updateUserProfile(
    UserBehaviorProfile profile,
    Map<String, dynamic> transaction,
    BehavioralAnalysisResult analysis
  ) async {
    // TODO: Implement profile updating logic
    profile.lastUpdated = DateTime.now();
  }
}
