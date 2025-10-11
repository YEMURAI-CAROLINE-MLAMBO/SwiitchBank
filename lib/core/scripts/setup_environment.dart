import '../config/environment_manager.dart';

void main() {
  print('Setting up environment...');
  print('Current environment: \${EnvironmentManager.currentEnv}');
  final config = EnvironmentManager.getConfig;
  print('API Base URL: \${config('api_base_url')}');
  print('Using mock APIs: \${config('use_mock_apis')}');
  print('Log level: \${config('log_level')}');
  print('Environment setup complete.');
}
