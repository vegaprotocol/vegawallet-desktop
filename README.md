# vegawallet-desktop

vegawallet-desktop is a graphical desktop application of Vega Protocol's [wallet](https://github.com/vegaprotocol/vegawallet/) for Windows, MacOS and Linux.

## Development

### Dependencies

#### Wails

This project uses [Wails](https://wails.app) to build the desktop app. To install Wails, follow the instruction on its [Getting started](https://wails.app/gettingstarted/) page.

Be sure to have the following environment variables set:

- `CGO_ENABLED=1`
- `GO111MODULE=on`

```sh
go install github.com/wailsapp/wails/v2/cmd/wails@v2.0.0-beta.32
```

To check if you have the correct dependencies installed, use the following command:

```sh
wails doctor
```

#### Frontend

Make sure to have at least **Node v16.13.2** installed.

The supported version of Typescript is **4.3.5**.

### Build

Compile the project using the `build` command.

```sh
wails build
```

This will compile your project and save the production-ready binary in the `build/bin`
directory.

More at the [Wails documentation](https://wails.app/reference/cli/#build).

### Develop

The backend embeds files from the `frontend/dist` folder. On a new environment, the `frontend/dist` folder is not populated, and will result of the following failure if wails is run first:

```
pattern frontend/dist: cannot embed directory frontend/dist: contains no embeddable files
```

As a result, we need to run the frontend first, so wails can embed actual files.

```sh
cd frontend
npm run dev
```

This will build the frontend and watch for further changes. Note we don't run vite in its default development mode as this will also start its on dev server. Instead, we just want to compile the frontend and serve the assets to the wails development server.

Then, in a separate tab, start the development environment using the following command:

```sh
wails dev
```

This will start the app running on `localhost:34115`. See the `devserverurl` property in `wails.json`.

#### Generate Go binding

Use the following command:

```sh
wails generate module
```

#### Common issues

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

#### Frontend

Go to the `frontend` directory, and launch the test runner in the interactive watch mode:

```sh
npm run test
```

## Support

**[Documentation](https://docs.vega.xyz/)**

Get API reference documentation, learn more about how Vega works, and explore sample scripts for API trading

**[Wallet documentation](https://docs.vega.xyz/docs/tools/vega-wallet/desktop-app)**

Learn about how Vega interacts with wallets.

**[Nolt](https://vega-testnet.nolt.io/)**

Raise issues and see what others have raised.

**[Discord](https://vega.xyz/discord)**

Ask us for help, find out about scheduled open sessions, and keep up with Vega generally.

## About Vega

[Vega][vega-website] is a protocol for creating and trading derivatives on a fully decentralised network. The network, secured with proof-of-stake, will facilitate fully automated, end-to-end margin trading and execution of complex financial products. Anyone will be able to build decentralised markets using the protocol.

Read more at [https://vega.xyz][vega-website].

[vega-website]: https://vega.xyz
