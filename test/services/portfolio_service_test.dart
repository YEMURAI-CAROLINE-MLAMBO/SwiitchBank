// test/services/portfolio_service_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:swiitch/services/jools/gemini_jools_service.dart';
import 'package.swiitch/services/portfolio/portfolio_service.dart';

void main() {
  group('PortfolioService', () {
    test('updateCryptoHoldings does not throw', () {
      final portfolioService = PortfolioService();
      final cryptoUpdate = CryptoUpdate();
      expect(() async => await portfolioService.updateCryptoHoldings(cryptoUpdate), returnsNormally);
    });
  });
}
