#!/usr/bin/env bash

set -euo pipefail

cat wails.fairground.json > wails.json
cat build/appicon.fairground.png > build/appicon.png

VITE_FEATURE_FAIRGROUND_MODE='true' wails build -f -clean -tags fairground
