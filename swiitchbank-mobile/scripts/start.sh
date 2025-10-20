#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MOBILE_DIR="$(dirname "$SCRIPT_DIR")"
REPO_ROOT="$(dirname "$MOBILE_DIR")"

source "$REPO_ROOT/setup_flutter.sh"

(cd "$MOBILE_DIR" && flutter run)
