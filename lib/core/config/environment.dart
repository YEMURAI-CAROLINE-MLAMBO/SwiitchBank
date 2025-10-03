// lib/core/config/environment.dart
enum AppEnvironment { dev, staging, production }

class EnvironmentConfig {
  static AppEnvironment env = AppEnvironment.dev;

  static String get apiBaseUrl {
    switch (env) {
      case AppEnvironment.production:
        return 'https://api.swiitchbank.com';
      case AppEnvironment.staging:
        return 'https://staging-api.swiitchbank.com';
      default:
        return 'https://dev-api.swiitchbank.com';
    }
  }

  static bool get isProduction => env == AppEnvironment.production;
}