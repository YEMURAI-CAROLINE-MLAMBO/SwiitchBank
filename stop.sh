#!/bin/bash
set -e

echo "Stopping all services..."
./backend/scripts/stop.sh
./frontend/scripts/stop.sh
./swiitchbank-mobile/scripts/stop.sh
pkill -f "firebase emulators:start --only functions,auth"

echo "All services stopped!"
