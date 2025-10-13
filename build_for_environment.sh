#!/bin/bash
# build_for_environment.sh

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Select Environment
ENVIRONMENT=${1:-development}
echo "🚀 Starting build for $ENVIRONMENT environment..."

# 2. Define Environment-Specific Variables
# A more secure approach is to define the variables directly here
# or source them from a file that is NOT checked into version control.

API_BASE_URL=""
case $ENVIRONMENT in
  production)
    API_BASE_URL="https://api.swiitchbank.com/api"
    ;;
  staging)
    API_BASE_URL="https://staging.swiitchbank.com/api"
    ;;
  *)
    API_BASE_URL="http://localhost:3000/api"
    ;;
esac

echo "API_BASE_URL set to: $API_BASE_URL"

# 3. Build the Flutter Web App
echo "🏗️ Building SwiitchBank for $ENVIRONMENT..."
# Use --dart-define to pass compile-time variables to the app.
# This is more secure than using .env files for build scripts.
flutter build web --dart-define=API_BASE_URL=$API_BASE_URL

echo "✅ Build complete for $ENVIRONMENT. The output is in the build/web directory."
