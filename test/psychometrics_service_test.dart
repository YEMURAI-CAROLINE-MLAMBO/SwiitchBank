import 'package:flutter_test/flutter_test.dart';
import '../lib/core/models/psychometric_profile.dart';
import '../lib/services/psychometrics_service.dart';

void main() {
  group('PsychometricsService', () {
    late PsychometricsService service;

    setUp(() {
      service = PsychometricsService();
    });

    group('assessFromQuiz', () {
      test('should return initial profile for empty answers', () {
        final profile = service.assessFromQuiz({});
        expect(profile.riskTolerance, 0.5);
        expect(profile.spendingHabit, PersonalityTrait.moderate);
      });

      test('should correctly calculate profile from quiz answers', () {
        final answers = {
          0: PersonalityTrait.riskSeeker,
          1: PersonalityTrait.impulsiveSpender,
          2: PersonalityTrait.impulsiveSpender,
          3: PersonalityTrait.riskSeeker,
        };

        final profile = service.assessFromQuiz(answers);

        // It should identify the most frequent trait as the spending habit
        expect(profile.spendingHabit, PersonalityTrait.impulsiveSpender);

        // It should calculate risk tolerance based on the risk-related answers
        // (0.9 + 0.9) / 2 = 0.9
        expect(profile.riskTolerance, closeTo(0.9, 0.01));
      });

      test('should handle a mix of answers correctly', () {
        final answers = {
          0: PersonalityTrait.riskAverse,
          1: PersonalityTrait.disciplinedSaver,
          2: PersonalityTrait.moderate,
          3: PersonalityTrait.riskSeeker,
        };

        final profile = service.assessFromQuiz(answers);

        // All traits appear once, so it depends on implementation detail,
        // but we can check if it's one of the given ones.
        expect(profile.spendingHabit, isA<PersonalityTrait>());

        // (0.1 + 0.5 + 0.9) / 3 = 0.5
        expect(profile.riskTolerance, closeTo(0.5, 0.01));
      });
    });

    group('assessFromTransactions', () {
      test('should return initial profile for empty transactions', () {
        final profile = service.assessFromTransactions([]);
        expect(profile.riskTolerance, 0.5);
        expect(profile.spendingHabit, PersonalityTrait.moderate);
      });

      test('should identify DisciplinedSaver for high saving rate', () {
        final transactions = [
          Transaction(name: 'Salary', amount: 5000, date: DateTime.now()),
          Transaction(name: 'Rent', amount: -1000, date: DateTime.now()),
          Transaction(name: 'Groceries', amount: -500, date: DateTime.now()),
        ];
        // Saving rate = (5000 - 1500) / 5000 = 0.7 > 0.25
        final profile = service.assessFromTransactions(transactions);
        expect(profile.spendingHabit, PersonalityTrait.disciplinedSaver);
      });

       test('should identify ImpulsiveSpender for low saving rate and high volatility', () {
        final transactions = [
          Transaction(name: 'Salary', amount: 2000, date: DateTime.now()),
          Transaction(name: 'Big Screen TV', amount: -1500, date: DateTime.now()),
          Transaction(name: 'Dinner', amount: -100, date: DateTime.now()),
          Transaction(name: 'Concert Tickets', amount: -300, date: DateTime.now()),
          Transaction(name: 'Coffee', amount: -5, date: DateTime.now()),
        ];
        // Saving rate = (2000 - 1905) / 2000 = 0.0475 < 0.05
        // Volatility will be high due to the large TV purchase.
        final profile = service.assessFromTransactions(transactions);
        expect(profile.spendingHabit, PersonalityTrait.impulsiveSpender);
      });
    });
  });
}