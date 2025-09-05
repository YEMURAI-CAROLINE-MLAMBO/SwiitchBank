import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  static String? _apiBaseUrl;

  // Private constructor
  AppConfig._();

  // Asynchronous initialization
  static Future<void> load() async {
    await dotenv.load(fileName: ".env");
    _apiBaseUrl = dotenv.env['API_BASE_URL'];

    // You can add more environment variables here as needed
    // For example:
    // final String? frontendApiKey = dotenv.env['FRONTEND_API_KEY'];

    // Check for missing critical environment variables
    if (_apiBaseUrl == null) {
      // In a real app, you might want to throw an exception
      // or handle this case more gracefully.
      print("FATAL ERROR: API_BASE_URL is not set in the .env file.");
    }
  }

  // Static getter for the API base URL
  static String get apiBaseUrl {
    if (_apiBaseUrl == null) {
      throw Exception("AppConfig has not been initialized. Call AppConfig.load() first.");
    }
    return _apiBaseUrl!;
  }
}
