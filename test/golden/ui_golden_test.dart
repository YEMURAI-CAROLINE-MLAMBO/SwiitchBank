import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:golden_toolkit/golden_toolkit.dart';
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/screens/dashboard_screen.dart';
import 'package:swiitch/widgets/currency_selector.dart';

void main() {
  testGoldens('dashboard golden test', (tester) async {
    await loadAppFonts();
    final builder = DeviceBuilder()
      ..addScenario(
        widget: DashboardScreen(
          apiService: MockApiService(),
        ),
        name: 'default dashboard',
      );

    await tester.pumpDeviceBuilder(builder);

    await screenMatchesGolden(tester, 'dashboard_screen');
  });

  testGoldens('currency selector golden test', (tester) async {
    await loadAppFonts();
    final builder = DeviceBuilder()
      ..addScenario(
        widget: Scaffold(
          body: CurrencySelector(
            selectedCurrency: 'USD',
            onCurrencyChanged: (_) {},
          ),
        ),
        name: 'default currency selector',
      );

    await tester.pumpDeviceBuilder(builder);

    await screenMatchesGolden(tester, 'currency_selector');
  });
}

class MockApiService extends Fake implements ApiService {
  @override
  Future<List<Transaction>> getTransactions() async {
    return [
      Transaction(
          id: '1',
          amount: 100.0,
          description: 'Groceries',
          currency: 'USD',
          date: DateTime.now()),
      Transaction(
          id: '2',
          amount: -50.0,
          description: 'Coffee',
          currency: 'USD',
          date: DateTime.now()),
    ];
  }
}

class ApiService {
  Future<List<Transaction>> getTransactions() async {
    return [];
  }
}