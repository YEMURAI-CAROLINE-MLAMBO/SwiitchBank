// lib/core/development/dev_tools.dart

import '../config/environment_manager.dart';

// Placeholders for MockServiceManager, LocalWebhookServer, DemoDataGenerator, ApiInterceptor
// In a real application, these would be implemented classes.

class MockServiceManager {
  static void enableAllMocks() {
    print('Enabling all mock services...');
  }
}

class LocalWebhookServer {
  static void start() {
    print('Starting local webhook server...');
  }
}

class DemoDataGenerator {
  static void populateWithRealisticData() {
    print('Populating with realistic demo data...');
  }
}

class ApiInterceptor {
  static void setup({
    Function? onStripeCall,
    Function? onMarquetaCall,
    Function? onPlaidCall,
  }) {
    print('Setting up API interceptor...');
  }
}

class DevTools {
  static void enableDevelopmentMode() {
    // Bypass limitations in development
    EnvironmentManager.currentEnv = 'development';

    // Enable mock services
    MockServiceManager.enableAllMocks();

    // Use local webhook simulation
    LocalWebhookServer.start();

    // Generate demo data
    DemoDataGenerator.populateWithRealisticData();
  }

  static void simulateApiResponses() {
    // Intercept API calls and return realistic responses
    ApiInterceptor.setup(
      onStripeCall: (endpoint, data) => _simulateStripeResponse(endpoint),
      onMarquetaCall: (endpoint, data) => _simulateMarquetaResponse(endpoint),
      onPlaidCall: (endpoint, data) => _simulatePlaidResponse(endpoint),
    );
  }

  // Placeholder implementations for the private methods.
  // In a real application, these would return realistic simulated responses.

  static Map<String, dynamic> _simulateStripeResponse(String endpoint) {
    print('Simulating Stripe response for endpoint: $endpoint');
    return {'status': 'success', 'data': 'mock_stripe_data'};
  }

  static Map<String, dynamic> _simulateMarquetaResponse(String endpoint) {
    print('Simulating Marqueta response for endpoint: $endpoint');
    return {'status': 'success', 'data': 'mock_marqueta_data'};
  }

  static Map<String, dynamic> _simulatePlaidResponse(String endpoint) {
    print('Simulating Plaid response for endpoint: $endpoint');
    return {'status': 'success', 'data': 'mock_plaid_data'};
  }
}
