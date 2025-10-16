#!/bin/bash

echo "🧪 Running SwitchBank Test Suite"

# Set environment
export FLUTTER_TEST=true
export API_BASE_URL=http://localhost:3000

# Run unit tests
echo "📊 Running unit tests..."
flutter test test/unit/

# Run widget tests
echo "🎯 Running widget tests..."
flutter test test/widget/

# Run integration tests
echo "🚀 Running integration tests..."
flutter test test/integration/

# Generate coverage report
echo "📈 Generating coverage report..."
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html

echo "✅ All tests completed!"
open coverage/html/index.html  # Open coverage report