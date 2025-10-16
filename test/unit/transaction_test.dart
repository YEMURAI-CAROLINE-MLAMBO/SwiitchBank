import 'package:flutter_test/flutter_test.dart';
import 'package:swiitch/models/transaction.dart';

void main() {
  group('Transaction Model', () {
    test('should create transaction from JSON', () {
      final json = {
        'id': '1',
        'amount': 100.0,
        'description': 'Test',
        'currency': 'USD',
        'date': '2024-01-01T00:00:00Z',
      };

      final transaction = Transaction.fromJson(json);

      expect(transaction.id, '1');
      expect(transaction.amount, 100.0);
      expect(transaction.currency, 'USD');
    });

    test('should convert transaction to JSON', () {
      final transaction = Transaction(
        id: '1',
        amount: 100.0,
        description: 'Test',
        currency: 'USD',
        date: DateTime(2024, 1, 1),
      );

      final json = transaction.toJson();

      expect(json['id'], '1');
      expect(json['amount'], 100.0);
      expect(json['currency'], 'USD');
    });

    test('should not allow zero-amount transactions', () {
      expect(() => Transaction(id: '1', description: 'Test', currency: 'USD', date: DateTime.now(), amount: 0), throwsA(isA<ArgumentError>()));
    });
  });
}