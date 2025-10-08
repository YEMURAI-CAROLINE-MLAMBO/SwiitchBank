import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:swiitch/core/config/env/base_config.dart';

class ProdConfig implements BaseConfig {
  @override
  String get apiBaseUrl => dotenv.env['API_BASE_URL'] ?? 'https://api.swiitch.com/api';

  @override
  String get appName => dotenv.env['APP_NAME'] ?? 'SwiitchBank';

  @override
  bool get reportErrors => true;

  @override
  bool get reportToSentry => true;
}