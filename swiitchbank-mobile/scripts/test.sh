#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
MOBILE_DIR="$(dirname "$SCRIPT_DIR")"

(cd "$MOBILE_DIR" && flutter test)
