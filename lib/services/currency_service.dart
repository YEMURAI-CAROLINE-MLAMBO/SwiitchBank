import 'dart:convert';
import 'package:http/http.dart' as http;

class CurrencyService {
  final http.Client client;
  final Map<String, double> _cache = {};

  CurrencyService({required this.client});

  Future<double> convert(double amount, String from, String to) async {
    final rate = await _getExchangeRate(from, to);
    return amount * rate;
  }

  Future<double> _getExchangeRate(String from, String to) async {
    final cacheKey = '$from-$to';
    if (_cache.containsKey(cacheKey)) {
      return _cache[cacheKey]!;
    }

    // This is a dummy URL, as the real API is not specified.
    final url = Uri.parse('https://api.exchangeratesapi.io/latest?base=$from&symbols=$to');
    final response = await client.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final rate = data['rates'][to];
      _cache[cacheKey] = rate;
      return rate;
    } else {
      throw CurrencyConversionException('Failed to load exchange rate');
    }
  }
}

class CurrencyConversionException implements Exception {
  final String message;
  CurrencyConversionException(this.message);
}