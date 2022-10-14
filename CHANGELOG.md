# Changelog

## Unreleased 0.3.0

### 🚨 Breaking changes

- [](https://github.com/vegaprotocol/vegawallet-desktop/issues/xxxx) -

### 🗑️ Deprecation

- [](https://github.com/vegaprotocol/vegawallet-desktop/issues/xxxx) -

### 🛠 Improvements
- [](https://github.com/vegaprotocol/vegawallet-desktop/issues/xxxx -
- [203](https://github.com/vegaprotocol/vegawallet-desktop/issues/203) - Adds dialog to get consent to telemetry
- [206](https://github.com/vegaprotocol/vegawallet-desktop/issues/206) - Delete wallet functionality
- [209](https://github.com/vegaprotocol/vegawallet-desktop/issues/209) - Adds dialog to control app settings
- [282](https://github.com/vegaprotocol/vegawallet-desktop/pull/283) - Upgrade to Cypress 10 and test improvements
- [261](https://github.com/vegaprotocol/vegawallet-desktop/issues/261) - Removes UI to start and stop proxy apps
- [332](https://github.com/vegaprotocol/vegawallet-desktop/issues/332) - Migrate to wails 2.0.0 (stable)
- [304](https://github.com/vegaprotocol/vegawallet-desktop/issues/304) - Warn Linux users about extra dependencies they need to install
- [325](https://github.com/vegaprotocol/vegawallet-desktop/issues/325) - Support Wallet Service API version 2

### 🐛 Fixes
- [358](https://github.com/vegaprotocol/vegawallet-desktop/issues/358) - Fix application crasher when not initialized
- [257](https://github.com/vegaprotocol/vegawallet-desktop/issues/257) - Update readme with more/improved links
- [264](https://github.com/vegaprotocol/vegawallet-desktop/issues/264) - Let the transaction review window grow with the main window
- [296](https://github.com/vegaprotocol/vegawallet-desktop/issues/296) - Service does not silently fail anymore if port is already in use

## 0.2.1

### 🐛 Fixes

- [274](https://github.com/vegaprotocol/vegawallet-desktop/issues/274) - Ensure transaction doesn't get serialized when nil in sent transaction event
- [252](https://github.com/vegaprotocol/vegawallet-desktop/issues/252) - Do not crash on Windows when creating log files
- [272](https://github.com/vegaprotocol/vegawallet-desktop/pull/272) - Update to latest version of Wails (v2.0.0-beta.40) to take advantage of new dev workflow features

## 0.2.0

### 🛠 Improvements

- [198](https://github.com/vegaprotocol/vegawallet-desktop/pull/198) - Output runtime logs in files.
- [162](https://github.com/vegaprotocol/vegawallet-desktop/pull/162) - Reword the message about unset endpoints.
- [84](https://github.com/vegaprotocol/vegawallet-desktop/pull/84) - Support defining a default network to connect to.
- [191](https://github.com/vegaprotocol/vegawallet-desktop/pull/191) - Add meaningful colors to service and proxies state indicator.
- [190](https://github.com/vegaprotocol/vegawallet-desktop/pull/190) - Add transaction review
- [249](https://github.com/vegaprotocol/vegawallet-desktop/pull/249) - Remove partial from `Config` since it is not

## 0.1.1

### 🛠 Improvements

- [180](https://github.com/vegaprotocol/vegawallet-desktop/pull/180) - Test Coverage for message signing

### 🐛 Fixes

- [179](https://github.com/vegaprotocol/vegawallet-desktop/pull/179) - App initialisation workflow now look for existing wallets before redirecting to on-boarding workflow.

## 0.1.0

### 🛠 Features

- Create a wallet
- Import a wallet
- Add key to a wallet
- Sign messages using a specific key
- Import a network configuration
- Edit a network configuration
- Start and stop the wallet service
- Start and stop the Token dApp
- Start and stop the Console
