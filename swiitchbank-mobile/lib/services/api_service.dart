import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://api.swiitchbank.com';

  static Map<String, String> get headers {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'SwiitchBank-Mobile',
      'X-App-Version': '1.0.0',
    };
  }

  static Future<Map<String, dynamic>> getUserFinancialData() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/financial/overview'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('SwiitchBank API Error: ${response.statusCode}');
    }
  }
}