import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:swiitch/core/config/env/base_config.dart';
import 'package:swiitch/core/config/env/dev_config.dart';
import 'package:swiitch/core/config/env/prod_config.dart';
import 'package:swiitch/core/config/env/stg_config.dart';

class Environment {
  factory Environment() {
    return _singleton;
  }

  Environment._();

  static final Environment _singleton = Environment._();

  static const String dev = 'DEV';
  static const String staging = 'STAGING';
  static const String prod = 'PROD';

  late BaseConfig config;

  Future<void> init(String environment) async {
    await _loadEnvFile(environment);
    config = _getConfig(environment);
  }

  Future<void> _loadEnvFile(String environment) async {
    final envFileName = '.env.${environment.toLowerCase()}';
    try {
      await dotenv.load(fileName: envFileName);
    } catch (e) {
      print('Could not load $envFileName file. Falling back to .env');
      await dotenv.load(fileName: ".env");
    }
  }

  BaseConfig _getConfig(String environment) {
    switch (environment) {
      case Environment.prod:
        return ProdConfig();
      case Environment.staging:
        return StgConfig();
      default:
        return DevConfig();
    }
  }
}