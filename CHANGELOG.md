# Changelog

## 0.12.3

### 🐛 Fixes

- [689](https://github.com/vegaprotocol/vegawallet-desktop/issues/689) - Order transactions from newest to oldest
- [690](https://github.com/vegaprotocol/vegawallet-desktop/issues/690) - Fix transaction logs overflow

## 0.12.2

### 🐛 Fixes

- [197](https://github.com/vegaprotocol/vegawallet-ui/issues/197) - Fix wallet locks

## 0.12.1

### 🛠 Improvements

- [681](https://github.com/vegaprotocol/vegawallet-desktop/issues/681) - Connect to the default network on first use per network mode

### 🐛 Fixes

- [683](https://github.com/vegaprotocol/vegawallet-desktop/issues/683) - Network compatibility warning fix
- [679](https://github.com/vegaprotocol/vegawallet-desktop/issues/679) - Fix transaction success screen logs copying
- [179](https://github.com/vegaprotocol/vegawallet-ui/issues/179) - Logs scroll fix

## 0.12.0

Support for vega v0.71.0.

## 0.11.4

### 🛠 Improvements

- [635](https://github.com/vegaprotocol/vegawallet-desktop/issues/635) - Reduce number of times you are prompted for your password
- [664](https://github.com/vegaprotocol/vegawallet-desktop/pulls/664) - Improve link instructions
- [659](https://github.com/vegaprotocol/vegawallet-desktop/pulls/659) - Add fairground test flow
- [659](https://github.com/vegaprotocol/vegawallet-desktop/pulls/659) - Add fairground test flow

### 🐛 Fixes

- [665](https://github.com/vegaprotocol/vegawallet-desktop/issues/665) - Fix an issue where entering your password when connecting with a single wallet was broken

## 0.11.3

Support for vega v0.70.4.

### 🛠 Improvements

- [611](https://github.com/vegaprotocol/vegawallet-desktop/issues/611) - Support a dedicated style for development version.
- [626](https://github.com/vegaprotocol/vegawallet-desktop/issues/626) - Add more shortcuts on the window to minimize the app

### 🐛 Fixes

- [652](https://github.com/vegaprotocol/vegawallet-desktop/issues/652) - Fix redirection while on-boarding on Fairground Wallet

## 0.11.2

Support for vega v0.70.4.

### 🛠 Improvements

- [576](https://github.com/vegaprotocol/vegawallet-desktop/issues/576) - Support different vega home for Mainnet and Testnet wallet
- [581](https://github.com/vegaprotocol/vegawallet-desktop/issues/581) - Add version of the sotfware in the window title.

### 🐛 Fixes

- [573](https://github.com/vegaprotocol/vegawallet-desktop/issues/573) - Indirectly fix `ERR_FILE_NOT_FOUND` error by separated Fairground and Mainnet software, so configuration files are not corrupted any more.

## 0.11.1

Support for vega v0.70.2.

### 🐛 Fixes

- [623](https://github.com/vegaprotocol/vegawallet-desktop/issues/623) - Ensure the user understand the transaction is being processed

## 0.11.0

Support for vega v0.70.0.

## 0.10.0

Support for vega v0.69.0.

## 0.9.0

Support for vega v0.68.0.

### 🛠 Improvements

- [476](https://github.com/vegaprotocol/vegawallet-desktop/issues/476) - Import fairground, mainnet1, and testnet2 auto-magically on every startup
- [495](https://github.com/vegaprotocol/vegawallet-desktop/issues/495) - Integrate with new wallet service config (not exposed yet)
- [491](https://github.com/vegaprotocol/vegawallet-desktop/issues/491) - Migrate MacOS notification to the UserNotification framework. However, this is still not working. Application is now brought to front when a review or an input from the user is required.
- [288](https://github.com/vegaprotocol/vegawallet-desktop/issues/288) - Pick up wallet updates made externally
- [508](https://github.com/vegaprotocol/vegawallet-desktop/issues/508) - Add custom "Main" menu on windows and Linux
- [516](https://github.com/vegaprotocol/vegawallet-desktop/issues/516) - Add a "Help" menu for all platforms with link to documentations, feedback boards and the releases page on GitHub.

### 🐛 Fixes

- [473](https://github.com/vegaprotocol/vegawallet-desktop/issues/473) - Clean up the application configuration if set with a non-existing network
- [500](https://github.com/vegaprotocol/vegawallet-desktop/issues/500) - Mark the service as not running when it failed to start
- [504](https://github.com/vegaprotocol/vegawallet-desktop/issues/504) - Validate `VegaHome` field in application config

## 0.8.3

Support for vega 0.67.3.

### 🐛 Fixes

- [422](https://github.com/vegaprotocol/vegawallet-desktop/issues/422) - Do not crash when application start with bad configuration
- [465](https://github.com/vegaprotocol/vegawallet-desktop/issues/465) Fall back to standard output logger if the startup logger can't be built

## 0.8.2

Support for vega 0.67.3.

## 0.8.1

Support for vega 0.67.2.

### 🛠 Improvements

- [457](https://github.com/vegaprotocol/vegawallet-desktop/issues/457) - Update vega core to work with version 0.67.2

## 0.8.0

Support for vega 0.67.1.

### 🛠 Improvements

- [457](https://github.com/vegaprotocol/vegawallet-desktop/issues/457) - Update vega core to work with version 0.67.1

## 0.7.0

Support for vega 0.66.1.

## 0.6.0

Support for vega 0.65.0.

## 0.5.0

Support for vega 0.64.0.

### 🛠 Improvements

- [424](https://github.com/vegaprotocol/vegawallet-desktop/issues/424) - Update to wails 2.2.0

## 0.4.0

Support for vega 0.62.0.

### 🛠 Improvements

- [420](https://github.com/vegaprotocol/vegawallet-desktop/issues/420) - Update vega version

## 0.3.0

### 🛠 Improvements

- [203](https://github.com/vegaprotocol/vegawallet-desktop/issues/203) - Adds dialog to get consent to telemetry
- [206](https://github.com/vegaprotocol/vegawallet-desktop/issues/206) - Delete wallet functionality
- [209](https://github.com/vegaprotocol/vegawallet-desktop/issues/209) - Adds dialog to control app settings
- [282](https://github.com/vegaprotocol/vegawallet-desktop/pull/283) - Upgrade to Cypress 10 and test improvements
- [261](https://github.com/vegaprotocol/vegawallet-desktop/issues/261) - Removes UI to start and stop proxy apps
- [332](https://github.com/vegaprotocol/vegawallet-desktop/issues/332) - Migrate to wails 2.0.0 (stable)
- [304](https://github.com/vegaprotocol/vegawallet-desktop/issues/304) - Warn Linux users about extra dependencies they need to install
- [325](https://github.com/vegaprotocol/vegawallet-desktop/issues/325) - Support Wallet Service API version 2
- [336](https://github.com/vegaprotocol/vegawallet-desktop/issues/336) - Trigger a notification when a back-end event is emitted on Windows and Linux
- [366](https://github.com/vegaprotocol/vegawallet-desktop/issues/366) - Trigger a notification when a back-end event is emitted on MacOS
- [324](https://github.com/vegaprotocol/vegawallet-desktop/issues/324) - Handle wallet version and network incompatibility

### 🐛 Fixes

- [358](https://github.com/vegaprotocol/vegawallet-desktop/issues/358) - Fix application crasher when not initialized
- [257](https://github.com/vegaprotocol/vegawallet-desktop/issues/257) - Update readme with more/improved links
- [264](https://github.com/vegaprotocol/vegawallet-desktop/issues/264) - Let the transaction review window grow with the main window
- [296](https://github.com/vegaprotocol/vegawallet-desktop/issues/296) - Service does not silently fail anymore if port is already in use
- [393](https://github.com/vegaprotocol/vegawallet-desktop/issues/393) - Ensure the on-boarding workflow is correctly handled

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
