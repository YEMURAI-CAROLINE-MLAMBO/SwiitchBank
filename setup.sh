#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
npm --prefix backend install

echo "Installing frontend dependencies..."
npm --prefix frontend install

echo "Installing functions dependencies..."
npm --prefix functions install

echo "Installing cli dependencies..."
npm --prefix cli install

echo "Setup complete!"
