#!/bin/bash
# setup_flutter.sh

# This script sets up the Flutter SDK path.
# It is intended to be sourced by other scripts.

# This script automatically detects and sets up the Flutter SDK path.

FLUTTER_SDK_PATH="/app/flutter_sdk"
FLUTTER_VERSION="3.22.1"
FLUTTER_ARCHIVE="flutter_linux_${FLUTTER_VERSION}-stable.tar.xz"
FLUTTER_URL="https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/${FLUTTER_ARCHIVE}"

# Check if the Flutter SDK is installed, and if not, install it.
if [ ! -d "$FLUTTER_SDK_PATH" ] || [ ! -f "$FLUTTER_SDK_PATH/bin/flutter" ]; then
    echo "Flutter SDK not found. Installing Flutter v${FLUTTER_VERSION}..."
    # Clean up any previous failed attempts
    rm -rf "$FLUTTER_SDK_PATH" /tmp/flutter

    # Download and extract to a temporary location
    mkdir -p /tmp
    wget -qO- "${FLUTTER_URL}" | tar -xJ -C /tmp

    # Move the SDK to the final destination
    mv /tmp/flutter "$FLUTTER_SDK_PATH"

    echo "Flutter SDK installed in ${FLUTTER_SDK_PATH}"
fi

export PATH="$FLUTTER_SDK_PATH/bin:$PATH"
echo "Flutter SDK path set to $FLUTTER_SDK_PATH"

# Verify that the flutter command is available
if ! command -v flutter &> /dev/null; then
    echo "ERROR: Flutter command not found after setup."
    exit 1
fi
