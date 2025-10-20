#!/bin/bash
set -e

echo "Starting backend..."
./backend/scripts/start.sh &

echo "Starting frontend..."
./frontend/scripts/start.sh &

echo "Starting mobile..."
./swiitchbank-mobile/scripts/start.sh &

echo "Starting Firebase emulators..."
firebase emulators:start --only functions,auth &

echo "All services started!"
