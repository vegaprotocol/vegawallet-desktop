#!/usr/bin/env bash

set -euo pipefail

optimizedFor="${WALLET_OPTIMIZED_FOR:-develop}"

cat wails."${optimizedFor}".json > wails.json
cat build/appicon."${optimizedFor}".png > build/appicon.png

VITE_FEATURE_MODE="${optimizedFor}" wails build -f -clean -tags "${optimizedFor}"
