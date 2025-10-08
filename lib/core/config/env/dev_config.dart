import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:swiitch/core/config/env/base_config.dart';

class DevConfig implements BaseConfig {
  @override
  String get apiBaseUrl => dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000/api';

  @override
  String get appName => dotenv.env['APP_NAME'] ?? 'SwiitchBank Dev';

  @override
  bool get reportErrors => false;

  @override
  bool get reportToSentry => false;
}