#!/bin/bash
set -e

echo "Starting backend..."
npm --prefix backend run dev &

echo "Starting frontend..."
npm --prefix frontend start &

echo "Starting Firebase emulators..."
firebase emulators:start --only functions,auth &

echo "All services started!"
