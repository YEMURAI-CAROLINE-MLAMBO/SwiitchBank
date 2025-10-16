#!/bin/bash

set -e

echo "🚀 Starting CI Test Pipeline"

# Validate environment
flutter doctor
flutter analyze

# Run tests with coverage
flutter test --coverage --coverage-path=coverage/lcov.info

# Upload coverage to codecov
bash <(curl -s https://codecov.io/bash) -t $CODECOV_TOKEN

# Run security tests
flutter test test/security/

# Performance tests
flutter drive --target=test_driver/app.dart

echo "🎉 CI Pipeline Completed Successfully"