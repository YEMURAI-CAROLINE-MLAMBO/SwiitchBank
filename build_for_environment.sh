#!/bin/bash
# build_for_environment.sh

source ./setup_flutter.sh

ENVIRONMENT=${1:-development}

echo "🏗️ Building SwiitchBank for $ENVIRONMENT"

# Placeholder functions for get_api_url and use_mock_apis
get_api_url() {
  case "$1" in
    production) echo "https://api.swiitchbank.com" ;;
    staging) echo "https://staging.swiitchbank.com" ;;
    *) echo "http://localhost:3000" ;;
  esac
}

use_mock_apis() {
  if [ "$1" = "development" ]; then
    echo "true"
  else
    echo "false"
  fi
}

# Set environment variables
export ENVIRONMENT=$ENVIRONMENT
export APP_NAME="SwiitchBank $ENVIRONMENT"

# Build with environment flags
flutter build web \
  --dart-define=ENVIRONMENT=$ENVIRONMENT \
  --dart-define=API_BASE_URL=$(get_api_url $ENVIRONMENT) \
  --dart-define=USE_MOCK_APIS=$(use_mock_apis $ENVIRONMENT)

echo "✅ Build complete for $ENVIRONMENT"
