# Vega Wallet desktop app

The Vega Wallet desktop app provides a graphical user interface for Vega Protocol's [wallet](https://github.com/vegaprotocol/vegawallet/) for Windows, MacOS and Linux.

[Latest release](https://github.com/vegaprotocol/vegawallet-desktop/releases): Download the latest release from the releases section.

[Wallet documentation](https://docs.vega.xyz/docs/mainnet/tools/vega-wallet/desktop-app/latest/getting-started): Read the quick-start guide for tips on using the desktop wallet app.

### Dependencies

This project uses [Wails](https://wails.io) to build the desktop app. To install Wails, follow the instruction on its [Getting started](https://wails.io/docs/gettingstarted/installation) page.

Be sure to have the following environment variables set:

- `CGO_ENABLED=1`
- `GO111MODULE=on`

```sh
go install github.com/wailsapp/wails/v2/cmd/wails@v2.3.1
```

To check if you have the correct dependencies installed, use the following command:

```sh
wails doctor
```

To be able to compile the frontend, you'll also need to install:

- nodejs >= **v18.12.0**
- yarn >= **v1.22.19**

#### Platform Specific Dependencies

Be sure to follow the installation guide from Wails. There are specific dependencies that needs to be installed.

For more details, see [https://wails.io/docs/gettingstarted/installation#platform-specific-dependencies](https://wails.io/docs/gettingstarted/installation#platform-specific-dependencies)

### Build

Compile the project using the `build` command.

```sh
wails build
```

This will compile your project and save the production-ready binary in the `build/bin`
directory.

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

It appears on MacOS. It's fixed by installing `watchman`:

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

Check out the [frontend guide](./frontend/README.md) to see how to run the end to end tests.

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

[Vega][vega-website] is a protocol for creating and trading derivatives on a fully decentralised network. The network, secured with proof-of-stake, will facilitate fully automated, end-to-end margin trading and execution of complex financial products. Anyone will be able to build decentralised markets using the protocol.

Read more at [https://vega.xyz][vega-website].

[vega-website]: https://vega.xyz
