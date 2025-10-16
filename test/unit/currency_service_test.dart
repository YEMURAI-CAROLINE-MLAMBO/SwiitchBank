import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:http/http.dart';
import 'package:swiitch/services/currency_service.dart';

class MockClient extends Mock implements Client {}

void main() {
  group('CurrencyService', () {
    late CurrencyService currencyService;
    late MockClient mockClient;

    setUp(() {
      mockClient = MockClient();
      currencyService = CurrencyService(client: mockClient);
    });

    test('should convert currencies correctly', () async {
      when(mockClient.get(any)).thenAnswer((_) async => Response(
        '{"rates": {"EUR": 0.85}}',
        200,
      ));

      final result = await currencyService.convert(100.0, 'USD', 'EUR');

      expect(result, 85.0);
    });

    test('should handle API errors', () async {
      when(mockClient.get(any)).thenAnswer((_) async => Response('', 500));

      expect(
        () => currencyService.convert(100.0, 'USD', 'EUR'),
        throwsA(isA<CurrencyConversionException>()),
      );
    });

    test('should cache exchange rates', () async {
      when(mockClient.get(any)).thenAnswer((_) async => Response(
        '{"rates": {"EUR": 0.85}}',
        200,
      ));

      await currencyService.convert(100.0, 'USD', 'EUR');
      await currencyService.convert(200.0, 'USD', 'EUR');

      verify(mockClient.get(any)).called(1); // Should only call once due to cache
    });
  });
}