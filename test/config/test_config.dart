const testConfig = {
  'timeouts': {
    'unit_test': Duration(seconds: 10),
    'widget_test': Duration(seconds: 30),
    'integration_test': Duration(minutes: 5),
  },
  'retry': {
    'flaky_tests': 3,
    'integration_tests': 2,
  },
  'coverage': {
    'minimum': 80.0,
    'exclude': [
      '**/*.g.dart',
      '**/*.freezed.dart',
      '**/generated/**',
    ],
  },
};