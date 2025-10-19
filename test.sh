#!/bin/bash
set -e

echo "Running backend tests..."
npm --prefix backend test

echo "Running frontend tests..."
npm --prefix frontend test -- --watchAll=false

echo "All tests complete!"
