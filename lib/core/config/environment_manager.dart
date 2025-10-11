// lib/core/config/environment_manager.dart
class EnvironmentManager {
  static const Map<String, dynamic> _environments = {
    'development': {
      'api_base_url': 'http://localhost:3000',
      'gemini_api_key': 'your_dev_gemini_key',
      'use_mock_apis': true,
      'log_level': 'debug',
    },
    'staging': {
      'api_base_url': 'https://staging.swiitchbank.com',
      'gemini_api_key': 'your_staging_gemini_key',
      'use_mock_apis': false,
      'log_level': 'info',
    },
    'production': {
      'api_base_url': 'https://api.swiitchbank.com',
      'gemini_api_key': 'your_prod_gemini_key',
      'use_mock_apis': false,
      'log_level': 'warning',
    },
  };

  static String currentEnv = 'development';

  static T getConfig<T>(String key) {
    return _environments[currentEnv]![key] as T;
  }
}
