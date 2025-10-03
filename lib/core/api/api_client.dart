import 'package:dio/dio.dart';
import 'package:swiitch/core/config/environment.dart';

class ApiException implements Exception {
  final String message;
  ApiException({required this.message});
}

class ApiClient {
  final Dio _dio = Dio();

  Future<Response> post(String endpoint, Map<String, dynamic> data) async {
    final String baseUrl = EnvironmentConfig.apiBaseUrl;
    try {
      return await _dio.post(
        '$baseUrl/$endpoint',
        data: data,
        options: Options(
          headers: await _getHeaders(),
        ),
      );
    } catch (e) {
      throw ApiException(message: 'Network error: $e');
    }
  }

  Future<Response> get(String endpoint) async {
    final String baseUrl = EnvironmentConfig.apiBaseUrl;
    try {
      return await _dio.get(
        '$baseUrl/$endpoint',
        options: Options(
          headers: await _getHeaders(),
        ),
      );
    } catch (e) {
      throw ApiException(message: 'Network error: $e');
    }
  }

  Future<Map<String, String>> _getHeaders() async {
    // This is a placeholder for a real authentication token retrieval mechanism
    Future<String> _getAuthToken() async => 'YOUR_AUTH_TOKEN';

    return {
      'Authorization': 'Bearer ${await _getAuthToken()}',
      'Content-Type': 'application/json',
      'X-Client-Version': '1.0.0',
    };
  }
}