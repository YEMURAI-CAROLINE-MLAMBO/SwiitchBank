#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MOBILE_DIR="$(dirname "$SCRIPT_DIR")"

source "$SCRIPT_DIR/../../setup_flutter.sh"
(cd "$MOBILE_DIR" && flutter test)
