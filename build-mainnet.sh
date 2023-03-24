#!/usr/bin/env bash

set -euo pipefail

cat wails.mainnet.json > wails.json
cat build/appicon.mainnet.png > build/appicon.png

wails build -f -clean
