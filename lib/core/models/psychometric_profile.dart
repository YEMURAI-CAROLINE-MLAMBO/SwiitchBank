// lib/core/models/psychometric_profile.dart

/// Represents the user's financial personality traits.
/// These are determined through quizzes or behavioral analysis.
enum PersonalityTrait {
  /// Cautious, prefers security over returns.
  riskAverse,

  /// Balanced approach to risk and reward.
  moderate,

  /// Willing to take significant risks for high returns.
  riskSeeker,

  /// Prone to making unplanned purchases.
  impulsiveSpender,

  /// Methodical and diligent about saving.
  disciplinedSaver,
}

/// Represents different styles of learning and communication.
/// Jools will adapt its communication based on this style.
enum LearningStyle {
  /// Prefers charts, graphs, and visual aids.
  visual,

  /// Prefers clear, concise, and to-the-point information.
  direct,

  /// Prefers narratives and real-life examples.
  storytelling,

  /// Prefers actionable steps and hands-on examples.
  practical,

  /// Prefers understanding the underlying concepts and models.
  theoretical,
}

/// Represents the complete psychometric profile of a user.
///
/// This model holds various behavioral and psychological traits that influence
/// a user's financial decisions, allowing for a hyper-personalized experience.
class FinancialProfile {
  /// A value from 0.0 (very averse) to 1.0 (very seeking).
  final double riskTolerance;

  /// The dominant financial personality trait of the user.
  final PersonalityTrait spendingHabit;

  /// The user's preferred method of receiving information.
  final LearningStyle learningStyle;

  /// A tendency to delay financial tasks. 0.0 (low) to 1.0 (high).
  final double procrastinationTendency;

  /// A tendency to be overly optimistic about financial abilities. 0.0 (low) to 1.0 (high).
  final double overconfidence;

  /// User-defined financial goals (e.g., "Save for a house", "Retire early").
  final List<String> financialGoals;

  FinancialProfile({
    required this.riskTolerance,
    required this.spendingHabit,
    required this.learningStyle,
    this.procrastinationTendency = 0.5,
    this.overconfidence = 0.5,
    this.financialGoals = const [],
  });

  /// Creates a default, empty profile for a new user.
  factory FinancialProfile.initial() {
    return FinancialProfile(
      riskTolerance: 0.5,
      spendingHabit: PersonalityTrait.moderate,
      learningStyle: LearningStyle.practical,
    );
  }

  /// Creates a FinancialProfile from a Firestore document.
  factory FinancialProfile.fromMap(Map<String, dynamic> map) {
    return FinancialProfile(
      riskTolerance: (map['riskTolerance'] as num?)?.toDouble() ?? 0.5,
      spendingHabit: PersonalityTrait.values.byName(map['spendingHabit'] ?? 'moderate'),
      learningStyle: LearningStyle.values.byName(map['learningStyle'] ?? 'practical'),
      procrastinationTendency: (map['procrastinationTendency'] as num?)?.toDouble() ?? 0.5,
      overconfidence: (map['overconfidence'] as num?)?.toDouble() ?? 0.5,
      financialGoals: List<String>.from(map['financialGoals'] ?? []),
    );
  }

  /// Converts a FinancialProfile instance to a map for Firestore.
  Map<String, dynamic> toMap() {
    return {
      'riskTolerance': riskTolerance,
      'spendingHabit': spendingHabit.name,
      'learningStyle': learningStyle.name,
      'procrastinationTendency': procrastinationTendency,
      'overconfidence': overconfidence,
      'financialGoals': financialGoals,
    };
  }

  /// Creates a copy of the profile with updated values.
  FinancialProfile copyWith({
    double? riskTolerance,
    PersonalityTrait? spendingHabit,
    LearningStyle? learningStyle,
    double? procrastinationTendency,
    double? overconfidence,
    List<String>? financialGoals,
  }) {
    return FinancialProfile(
      riskTolerance: riskTolerance ?? this.riskTolerance,
      spendingHabit: spendingHabit ?? this.spendingHabit,
      learningStyle: learningStyle ?? this.learningStyle,
      procrastinationTendency: procrastinationTendency ?? this.procrastinationTendency,
      overconfidence: overconfidence ?? this.overconfidence,
      financialGoals: financialGoals ?? this.financialGoals,
    );
  }
}