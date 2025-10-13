// test/services/database_service_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:swiitch/core/models/webhook_payloads.dart';
import 'package:swiitch/services/database/database_service.dart';

void main() {
  group('DatabaseService', () {
    test('storeTransaction does not throw', () {
      final dbService = DatabaseService();
      final transaction = PlaidTransaction(
        transactionId: '123',
        accountId: '456',
        amount: 100.0,
        isoCurrencyCode: 'USD',
        merchantName: 'Test Merchant',
        date: '2023-01-01',
        paymentChannel: 'online',
      );
      expect(() async => await dbService.storeTransaction(transaction), returnsNormally);
    });
  });
}
