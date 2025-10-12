#!/bin/bash
# setup_flutter.sh

# This script sets up the Flutter SDK path.
# It is intended to be sourced by other scripts.

# --- USER ACTION REQUIRED ---
# Please set FLUTTER_SDK_PATH to the absolute path of your Flutter SDK directory.
# For example:
# FLUTTER_SDK_PATH="/Users/your_user/development/flutter"

FLUTTER_SDK_PATH="" # <-- SET THIS PATH

if [ -z "$FLUTTER_SDK_PATH" ]; then
    echo "WARNING: FLUTTER_SDK_PATH is not set in setup_flutter.sh"
    echo "Attempting to find flutter in the PATH..."
    if command -v flutter &> /dev/null; then
        echo "Found flutter in PATH. Proceeding."
    else
        echo "ERROR: FLUTTER_SDK_PATH is not set and flutter is not in the PATH."
        echo "Please edit setup_flutter.sh and provide the path to the Flutter SDK."
        exit 1
    fi
else
    if [ -d "$FLUTTER_SDK_PATH" ]; then
        export PATH="$FLUTTER_SDK_PATH/bin:$PATH"
        echo "Flutter SDK path set to $FLUTTER_SDK_PATH"
    else
        echo "ERROR: The configured FLUTTER_SDK_PATH in setup_flutter.sh does not exist or is not a directory."
        echo "Path: $FLUTTER_SDK_PATH"
        exit 1
    fi
fi
