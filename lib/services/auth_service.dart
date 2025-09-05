import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:swiitch/config/app_config.dart';

class AuthService {
  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final String apiUrl = '${AppConfig.apiBaseUrl}/api/users/register';

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      final Map<String, dynamic> responseData = jsonDecode(response.body);

      if (response.statusCode == 201) {
        // Registration successful
        return {'success': true, 'data': responseData};
      } else {
        // Registration failed
        return {'success': false, 'message': responseData['message'] ?? 'An unknown error occurred'};
      }
    } catch (e) {
      // Network or other errors
      return {'success': false, 'message': 'Failed to connect to the server. Please check your network connection.'};
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final String apiUrl = '${AppConfig.apiBaseUrl}/api/users/login';

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final Map<String, dynamic> responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        // Login successful
        return {'success': true, 'data': responseData};
      } else {
        // Login failed
        return {'success': false, 'message': responseData['message'] ?? 'An unknown error occurred'};
      }
    } catch (e) {
      // Network or other errors
      return {'success': false, 'message': 'Failed to connect to the server. Please check your network connection.'};
    }
  }
}
