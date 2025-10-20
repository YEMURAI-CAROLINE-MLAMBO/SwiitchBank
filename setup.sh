#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
./backend/scripts/setup.sh

echo "Installing frontend dependencies..."
./frontend/scripts/setup.sh

echo "Setting up mobile..."
./swiitchbank-mobile/scripts/setup.sh

echo "Installing functions dependencies..."
npm --prefix functions install

echo "Installing cli dependencies..."
npm --prefix cli install

echo "Setup complete!"
