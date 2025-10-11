import 'dart:math';

import '../core/models/psychometric_profile.dart';

/// A simple model representing a financial transaction.
/// This is a placeholder based on mock data and may be refined later.
class Transaction {
  final String name;
  final double amount;
  final DateTime date;
  final String category; // e.g., 'Food', 'Transport', 'Income'

  Transaction({
    required this.name,
    required this.amount,
    required this.date,
    this.category = 'Uncategorized',
  });
}

/// A service for analyzing user behavior to determine their psychometric profile.
class PsychometricsService {
  /// Assesses a user's financial personality based on a list of transactions.
  ///
  /// This is a "Phase 1" implementation that uses simple heuristics.
  /// Future versions could use more sophisticated machine learning models.
  ///
  /// - **Risk Tolerance**: Inferred from the volatility of spending. High volatility
  ///   might suggest a higher tolerance for financial risk.
  /// - **Spending Habit**: Determined by comparing income to expenses and the
  ///   frequency of non-essential spending.
  FinancialProfile assessFromTransactions(List<Transaction> transactions) {
    if (transactions.isEmpty) {
      return FinancialProfile.initial();
    }

    final spendingVolatility = _calculateSpendingVolatility(transactions);
    final savingRate = _calculateSavingRate(transactions);

    PersonalityTrait spendingHabit;
    if (savingRate < 0.05 && spendingVolatility > 0.7) {
      spendingHabit = PersonalityTrait.impulsiveSpender;
    } else if (savingRate > 0.25) {
      spendingHabit = PersonalityTrait.disciplinedSaver;
    } else {
      spendingHabit = PersonalityTrait.moderate;
    }

    // Normalize volatility to a 0.0-1.0 scale for risk tolerance.
    // This is a simplified heuristic.
    final riskTolerance = (spendingVolatility / 2.0).clamp(0.0, 1.0);

    return FinancialProfile(
      riskTolerance: riskTolerance,
      spendingHabit: spendingHabit,
      // Default learning style, can be updated via quiz.
      learningStyle: LearningStyle.practical,
    );
  }

  /// Assesses a user's financial profile based on their quiz answers.
  ///
  /// This method aggregates the traits from the quiz answers to form a
  /// profile, providing a more direct assessment than transaction analysis.
  FinancialProfile assessFromQuiz(Map<int, PersonalityTrait> answers) {
    if (answers.isEmpty) {
      return FinancialProfile.initial();
    }

    final counts = <PersonalityTrait, int>{};
    for (var trait in answers.values) {
      counts[trait] = (counts[trait] ?? 0) + 1;
    }

    // Determine the dominant spending habit.
    final spendingHabit = counts.entries.reduce((a, b) => a.value > b.value ? a : b).key;

    // Estimate risk tolerance based on answers.
    double riskScore = 0;
    int riskQuestions = 0;
    answers.values.forEach((trait) {
      if (trait == PersonalityTrait.riskAverse) {
        riskScore += 0.1;
        riskQuestions++;
      } else if (trait == PersonalityTrait.moderate) {
        riskScore += 0.5;
        riskQuestions++;
      } else if (trait == PersonalityTrait.riskSeeker) {
        riskScore += 0.9;
        riskQuestions++;
      }
    });

    final riskTolerance = (riskQuestions > 0) ? riskScore / riskQuestions : 0.5;

    return FinancialProfile(
      riskTolerance: riskTolerance,
      spendingHabit: spendingHabit,
      // Learning style would be determined by a different set of questions.
      learningStyle: LearningStyle.practical, // Default for now
    );
  }

  /// Calculates the volatility of spending (standard deviation of expenses).
  /// A higher value indicates more erratic, less predictable spending.
  double _calculateSpendingVolatility(List<Transaction> transactions) {
    final expenses = transactions.where((t) => t.amount < 0).map((t) => t.amount.abs()).toList();
    if (expenses.length < 2) {
      return 0.0;
    }

    final mean = expenses.reduce((a, b) => a + b) / expenses.length;
    final variance = expenses.map((x) => pow(x - mean, 2)).reduce((a, b) => a + b) / expenses.length;
    final stdDev = sqrt(variance);

    // Normalize by the mean to get a coefficient of variation, which is a better
    // measure of volatility relative to the average spending amount.
    return mean > 0 ? stdDev / mean : 0.0;
  }

  /// Calculates the saving rate as (total income - total expenses) / total income.
  double _calculateSavingRate(List<Transaction> transactions) {
    final totalIncome = transactions
        .where((t) => t.amount > 0)
        .map((t) => t.amount)
        .fold(0.0, (a, b) => a + b);

    final totalExpenses = transactions
        .where((t) => t.amount < 0)
        .map((t) => t.amount.abs())
        .fold(0.0, (a, b) => a + b);

    if (totalIncome == 0) {
      return 0.0; // Cannot calculate saving rate without income.
    }

    return (totalIncome - totalExpenses) / totalIncome;
  }
}