#!/bin/bash
echo "🔧 SWIITCHBANK ENVIRONMENT FIXER"

source ./setup_flutter.sh

# 1. Flutter Environment
flutter clean
flutter pub get
flutter pub deps

# 2. Firebase Environment
firebase --version
firebase projects:list
firebase use swiitchbank-09410265

# 3. API Key Validation
echo "Validating environment variables:"
if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ GEMINI_API_KEY not set"
else
  echo "✅ GEMINI_API_KEY is set"
fi

# 4. Path & Dependency Resolution
export PATH="$PATH":"$HOME/.pub-cache/bin"
dart fix --apply
