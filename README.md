# Vega Wallet desktop app

The Vega Wallet desktop app provides a graphical user interface for Vega Protocol's [wallet](https://github.com/vegaprotocol/vegawallet/) for Windows, macOS and Linux.

[Latest release](https://github.com/vegaprotocol/vegawallet-desktop/releases): Download the latest release from the releases section.

[Wallet documentation](https://docs.vega.xyz/docs/mainnet/tools/vega-wallet/desktop-app/latest/getting-started): Read the quick-start guide for tips on using the desktop wallet app.

## Supported platforms

**macOS:** >= 10.13 (High Sierra)
**Windows:** >= 8
**Linux:** Supported, but the minimum version is unknown.

### Dependencies

#### Golang

You will need to go 1.20.

#### Wails

This project uses [Wails](https://wails.io) to build the desktop app. To install Wails, follow the instruction on its [Getting started](https://wails.io/docs/gettingstarted/installation) page.

Be sure to have the following environment variables set:

- `CGO_ENABLED=1`
- `GO111MODULE=on`

```sh
go install github.com/wailsapp/wails/v2/cmd/wails@v2.4.1
```

To check if you have the correct dependencies installed, use the following command:

```sh
wails doctor
```

#### Frontend

To be able to compile the frontend, you'll also need to install:

- nodejs >= **v18.12.0**
- yarn >= **v1.22.19**

#### Platform Specific Dependencies

Be sure to follow the installation guide from Wails. Specific dependencies need to be installed.

For more details, see [https://wails.io/docs/gettingstarted/installation#platform-specific-dependencies](https://wails.io/docs/gettingstarted/installation#platform-specific-dependencies)

### Build

This will compile your project and save the production-ready binary in the `build/bin`
directory.

**Note, this application can be bundle specifically for fairground or mainnet.**

#### Using the script `build.sh`

There are scripts that ease the switch between fairground and mainnet:

**For fairground:**

```sh
WALLET_OPTIMIZED_FOR=fairground ./build.sh
```

**For mainnet:**

```sh
WALLET_OPTIMIZED_FOR=mainnet ./build.sh
```

Ensure you set the executable mode on the scripts:

```sh
chmod +x build-*.sh
```

#### Using `wails`

Compile the project using the `wails build` command. This will produce a software optimized for mainnet.

```sh
wails build -f -clean
```

To compile the optimization for fairground:

```sh
wails build -f -clean -tags fairground
```

**Note that this step alone won't correctly bundle the application for fairground.** Hacks must be performed to have the right bundle name, metadata and icon. See `build.sh` script for more detail.

More at the [Wails documentation](https://wails.io/docs/reference/cli#build).

### Development

The backend embeds files from the `frontend/dist` folder. On a new environment, the `frontend/dist` folder is not populated, and will result of the following failure if wails is run first:

```
pattern frontend/dist: cannot embed directory frontend/dist: contains no embeddable files
```

As a result, we need to run the frontend first, so wails can embed actual files for start up the app for the first time.

```sh
cd frontend
yarn build
```

Then run

```sh
wails dev
```

This will start the app running on `localhost:34115`, as well as starting up [Vite](https://vitejs.dev/) to handle watching for any changes and hot reloading the frontend. See [`wails.json`](https://wails.io/docs/reference/project-config) for further configuration options. For more details on developing the frontend code, check out the [frontend readme](./frontend/README.md).

### Feature flags

These flags are passed as environment variables to the app. They are used to enable/disable features. For example:

```bash
VITE_FEATURE_MODE='fairground' wails dev
```

or

```bash
VITE_FEATURE_MODE='fairground' wails build
```

A full list of these can be found below:

| Flag                         | Description                                                                                  |
|------------------------------|----------------------------------------------------------------------------------------------|
| VITE_FEATURE_NETWORK_WARNING | Enable warning the user if the network is a different version for the one configured for the |
| VITE_FEATURE_TELEMETRY_CHECK | Enable users being asked if they would like to send bug reports for the application          |
| VITE_FEATURE_MODE            | Build the app in fairground mode with different styling/messaging that is mode specific      |

### More commands

To generate the go bindings for the frontend, you can run:

```sh
wails generate module
```

### Common issues

##### Too many open files

```
Error: EMFILE: too many open files, watch
    at FSEvent.FSWatcher._handle.onchange (node:internal/fs/watchers:204:21)
```

It is raised on macOS. It is fixed by installing `watchman`:

```sh
brew install watchman
```

### Testing

#### Backend

To launch the backend tests, use the following commands:

```sh
go test ./...
```

#### End to end

Check out the [frontend guide](./frontend/README.md) to see how to run the end-to-end tests.

## Support

**[Documentation](https://docs.vega.xyz/)**

Get API reference documentation and learn more about how Vega works.

**[Wallet documentation](https://docs.vega.xyz/docs/mainnet/tools/vega-wallet/desktop-app)**

Read a quick-start guide for tips on using the desktop wallet app.

**[Feedback](https://github.com/vegaprotocol/feedback/discussions/categories/vega-wallets)**

Raise issues and see what others have raised.

**[Discord](https://vega.xyz/discord)**

Ask us for help, find out about scheduled open sessions, and keep up with Vega generally.

## About Vega

[Vega][vega-website] is a protocol for creating and trading derivatives on a fully decentralized network. The network, secured with proof-of-stake, will facilitate fully automated, end-to-end margin trading and execution of complex financial products. Anyone will be able to build decentralized markets using the protocol.

Read more at [https://vega.xyz][vega-website].

[vega-website]: https://vega.xyz
