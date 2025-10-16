import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:swiitch/widgets/currency_selector.dart';

void main() {
  testWidgets('should display selected currency', (WidgetTester tester) async {
    String selectedCurrency = 'USD';

    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: CurrencySelector(
          selectedCurrency: selectedCurrency,
          onCurrencyChanged: (currency) => selectedCurrency = currency,
        ),
      ),
    ));

    expect(find.text('USD'), findsOneWidget);
  });

  testWidgets('should update when currency changes', (WidgetTester tester) async {
    String selectedCurrency = 'USD';

    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: CurrencySelector(
          selectedCurrency: selectedCurrency,
          onCurrencyChanged: (currency) {
            selectedCurrency = currency;
          },
        ),
      ),
    ));

    await tester.tap(find.text('USD'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('EUR').last);
    await tester.pump();

    expect(selectedCurrency, 'EUR');
  });
}