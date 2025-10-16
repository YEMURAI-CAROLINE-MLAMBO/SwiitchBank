import 'package:flutter_test/flutter_test.dart';
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/security/fraud_detection.dart';

void main() {
  group('FraudDetection', () {
    test('should detect unusual transaction amounts', () {
      final normalTransaction = Transaction(id: '1', amount: 100.0, description: 'test', currency: 'USD', date: DateTime.now());
      final unusualTransaction = Transaction(id: '1', amount: 10000.0, description: 'test', currency: 'USD', date: DateTime.now());
      final userHistory = UserHistory(averageTransaction: 150.0);

      expect(
        FraudDetection.isUnusualAmount(normalTransaction, userHistory),
        false,
      );
      expect(
        FraudDetection.isUnusualAmount(unusualTransaction, userHistory),
        true,
      );
    });

    test('should detect rapid transactions', () {
      final transactions = [
        Transaction(id: '1', amount: 100.0, date: DateTime.now().subtract(Duration(minutes: 1)), description: 'test', currency: 'USD'),
        Transaction(id: '2', amount: 200.0, date: DateTime.now().subtract(Duration(minutes: 2)), description: 'test', currency: 'USD'),
        Transaction(id: '3', amount: 300.0, date: DateTime.now().subtract(Duration(minutes: 3)), description: 'test', currency: 'USD'),
      ];

      expect(FraudDetection.detectRapidTransactions(transactions), true);
    });

    test('should calculate risk score correctly', () {
      final transaction = Transaction(
        id: '1',
        amount: 5000.0,
        currency: 'USD',
        description: 'test',
        date: DateTime.now(),
      );

      final userBehavior = UserBehavior(
        typicalAmount: 100.0,
        typicalLocation: Location(lat: 40.7128, lng: -74.0060),
      );

      final riskScore = FraudDetection.calculateRiskScore(transaction, userBehavior);

      expect(riskScore, greaterThan(0.5)); // High risk due to amount
    });
  });
}