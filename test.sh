#!/bin/bash
set -e

echo "Running backend tests..."
./backend/scripts/test.sh

echo "Running frontend tests..."
./frontend/scripts/test.sh

echo "Running mobile tests..."
./swiitchbank-mobile/scripts/test.sh

echo "All tests complete!"
