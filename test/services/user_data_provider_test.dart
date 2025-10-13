// test/services/user_data_provider_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:swiitch/core/models/webhook_payloads.dart';
import 'package:swiitch/ui/providers/user_data_provider.dart';

void main() {
  group('UserDataProvider', () {
    test('updateTransactionList notifies listeners', () {
      final provider = UserDataProvider();
      bool notified = false;
      provider.addListener(() {
        notified = true;
      });
      final transaction = PlaidTransaction(transactionId: '1');
      provider.updateTransactionList(transaction);
      expect(notified, isTrue);
      expect(provider.transactions.length, 1);
    });

    test('updatePaymentStatus notifies listeners', () {
      final provider = UserDataProvider();
      bool notified = false;
      provider.addListener(() {
        notified = true;
      });
      final payment = StripePayment(id: 'py_1');
      provider.updatePaymentStatus(payment);
      expect(notified, isTrue);
      expect(provider.latestPayment.id, 'py_1');
    });
  });
}
