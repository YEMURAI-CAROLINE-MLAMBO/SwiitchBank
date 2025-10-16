import 'package:flutter/material.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/models/user.dart';
import 'package:swiitch/services/api_service.dart';

// Mock classes
class MockApiService extends Mock implements ApiService {}
class MockClient extends Mock implements http.Client {}
class MockNavigatorObserver extends Mock implements NavigatorObserver {}

// Test data factories
Transaction createTestTransaction({
  String id = '1',
  double amount = 100.0,
  String description = 'Test',
  String currency = 'USD',
}) {
  return Transaction(
    id: id,
    amount: amount,
    description: description,
    currency: currency,
    date: DateTime.now(),
  );
}

User createTestUser({
  String id = '1',
  String name = 'Test User',
  String baseCurrency = 'USD',
}) {
  return User(
    id: id,
    name: name,
    baseCurrency: baseCurrency,
  );
}

// Widget test utilities
Future<void> pumpApp(WidgetTester tester, Widget widget) async {
  await tester.pumpWidget(MaterialApp(
    home: widget,
    navigatorObservers: [MockNavigatorObserver()],
  ));
}