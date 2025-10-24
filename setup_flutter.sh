#!/bin/bash
# setup_flutter.sh

# This script sets up the Flutter SDK path.
# It is intended to be sourced by other scripts.

# This script automatically detects and sets up the Flutter SDK path.

FLUTTER_SDK_PATH="flutter_sdk"

if [ ! -d "$FLUTTER_SDK_PATH" ]; then
  echo "Flutter SDK not found. Cloning from GitHub..."
  git clone https://github.com/flutter/flutter.git "$FLUTTER_SDK_PATH"
  cd "$FLUTTER_SDK_PATH"
  git checkout stable
  cd -
fi

if [ -n "$FLUTTER_SDK_PATH" ] && [ -d "$FLUTTER_SDK_PATH" ]; then
    export PATH="$FLUTTER_SDK_PATH/bin:$PATH"
    echo "Flutter SDK path set to $FLUTTER_SDK_PATH"
else
    echo "WARNING: Flutter SDK not found in common locations."
    echo "Attempting to find flutter in the PATH..."
    if command -v flutter &> /dev/null; then
        echo "Found flutter in PATH. Proceeding."
    else
        echo "ERROR: Flutter SDK not found. Please ensure it is installed and accessible."
        exit 1
    fi
fi
