// test/services/payment_service_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package/swiitch/core/models/webhook_payloads.dart';
import 'package:swiitch/services/payment/payment_service.dart';

void main() {
  group('PaymentService', () {
    test('recordPayment does not throw', () {
      final paymentService = PaymentService();
      final payment = StripePayment(
        id: 'py_123',
        amount: 200.0,
        currency: 'usd',
        status: 'succeeded',
      );
      expect(() async => await paymentService.recordPayment(payment), returnsNormally);
    });
  });
}
