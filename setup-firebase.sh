#!/bin/bash
echo "Setting up Firebase for SwitchBank..."

# Install Firebase CLI if not installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase
firebase login --no-browser

# Initialize Firebase project
echo "Initializing Firebase project. Please select your Firebase project when prompted."
# We are assuming that firebase init has already been run, or will be run separately
# Removing interactive init steps from here to make it idempotent for script use
# firebase init firestore
# firebase init functions
# firebase init emulators

# Install function dependencies
if [ -d "functions" ]; then
  echo "Installing functions dependencies..."
  cd functions
  npm install
  cd ..
else
  echo "Functions directory not found. Skipping functions dependencies installation."
fi

echo "Firebase setup script finished."
echo "Remember to run 'firebase init' manually if you haven't already."
echo "Start emulators with: firebase emulators:start"