import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart' as http;
import 'package:swiitch/models/transaction.dart';
import 'package:swiitch/services/sophia_service.dart';

class MockClient extends Mock implements http.Client {}

void main() {
  group('SophiaService', () {
    late MockClient mockClient;
    late SophiaService sophiaService;

    setUp(() {
      mockClient = MockClient();
      sophiaService = SophiaService(client: mockClient);
    });

    test('should analyze transactions successfully', () async {
      final transactions = [Transaction(id: '1', amount: 100.0, description: 'Test', currency: 'USD', date: DateTime.now())];
      final mockResponse = {
        'insights': 'Spending pattern detected',
        'confidence': 0.85
      };

      when(mockClient.post(any, body: anyNamed('body')))
          .thenAnswer((_) async => http.Response(json.encode(mockResponse), 200));

      final analysis = await sophiaService.analyzeTransactions(transactions);

      expect(analysis.insights, 'Spending pattern detected');
      expect(analysis.confidence, 0.85);
    });

    test('should handle API rate limiting', () async {
      when(mockClient.post(any, body: anyNamed('body')))
          .thenAnswer((_) async => http.Response('', 429));

      expect(
        () => sophiaService.analyzeTransactions([]),
        throwsA(isA<RateLimitException>()),
      );
    });

    test('should validate transaction data before sending', () async {
      final invalidTransactions = [Transaction(id: '1', amount: double.nan, description: 'test', currency: 'USD', date: DateTime.now())];

      expect(
        () => sophiaService.analyzeTransactions(invalidTransactions),
        throwsA(isA<ArgumentError>()),
      );
    });
  });
}