import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/screens/dashboard_screen.dart';
import 'package:swiitch/services/api_service.dart';

class MockApiService extends Mock implements ApiService {}

void main() {
  group('DashboardScreen', () {
    late MockApiService mockApiService;

    setUp(() {
      mockApiService = MockApiService();
    });

    testWidgets('should display loading indicator initially', (WidgetTester tester) async {
      when(mockApiService.getTransactions()).thenAnswer((_) async => []);

      await tester.pumpWidget(MaterialApp(
        home: DashboardScreen(apiService: mockApiService),
      ));

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('should display transactions after loading', (WidgetTester tester) async {
      final transactions = [
        Transaction(id: '1', amount: 100.0, description: 'Test 1', currency: 'USD', date: DateTime.now()),
        Transaction(id: '2', amount: -50.0, description: 'Test 2', currency: 'USD', date: DateTime.now()),
      ];

      when(mockApiService.getTransactions()).thenAnswer((_) async => transactions);

      await tester.pumpWidget(MaterialApp(
        home: DashboardScreen(apiService: mockApiService),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Test 1'), findsOneWidget);
      expect(find.text('Test 2'), findsOneWidget);
      expect(find.text('\$100.00'), findsOneWidget);
      expect(find.text('-\$50.00'), findsOneWidget);
    });

    testWidgets('should show error message on API failure', (WidgetTester tester) async {
      when(mockApiService.getTransactions()).thenThrow(Exception('API Error'));

      await tester.pumpWidget(MaterialApp(
        home: DashboardScreen(apiService: mockApiService),
      ));
      await tester.pumpAndSettle();

      expect(find.text('Failed to load transactions'), findsOneWidget);
      expect(find.text('Retry'), findsOneWidget);
    });
  });
}