#!/bin/bash
set -e

echo "Stopping all services..."
pkill -f "npm --prefix backend run dev"
pkill -f "npm --prefix frontend start"
pkill -f "firebase emulators:start --only functions,auth"

echo "All services stopped!"
