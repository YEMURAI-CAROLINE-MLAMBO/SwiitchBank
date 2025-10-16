import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:swiitch/main.dart';
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/screens/dashboard_screen.dart';
import 'package:swiitch/widgets/balance_card.dart';
import 'package:swiitch/widgets/transaction_list.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('App Flow', () {
    testWidgets('complete user journey', (WidgetTester tester) async {
      // Start app
      await tester.pumpWidget(SwitchBankApp());

      // Verify dashboard loads
      expect(find.text('SwitchBank Dashboard'), findsOneWidget);
      expect(find.byType(BalanceCard), findsOneWidget);

      // Navigate to transactions
      await tester.tap(find.byIcon(Icons.list));
      await tester.pumpAndSettle();

      expect(find.byType(TransactionList), findsOneWidget);

      // Navigate to bridge screen
      await tester.tap(find.text('Bridge'));
      await tester.pumpAndSettle();

      expect(find.text('Fiat-Crypto Bridge'), findsOneWidget);

      // Test currency conversion
      await tester.enterText(find.byType(TextField).first, '100');
      await tester.pump();

      expect(find.textContaining('BTC'), findsOneWidget);
    });
  });
}