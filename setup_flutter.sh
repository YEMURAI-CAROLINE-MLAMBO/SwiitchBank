#!/bin/bash
# setup_flutter.sh

# This script sets up the Flutter SDK path.
# It is intended to be sourced by other scripts.

# This script automatically detects and sets up the Flutter SDK path.

# Attempt to find the Flutter SDK in a common location
if [ -d "/app/flutter_sdk" ]; then
    FLUTTER_SDK_PATH="/app/flutter_sdk"
elif [ -d "$HOME/flutter_sdk" ]; then
    FLUTTER_SDK_PATH="$HOME/flutter_sdk"
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
