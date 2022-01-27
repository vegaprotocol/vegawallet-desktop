# vegawallet-desktop

vegawallet-desktop is a graphical desktop application of Vega
Protocol's [wallet](https://github.com/vegaprotocol/vegawallet/) for Windows, MacOS
and Linux.

## Development

### Dependencies

#### Wails
This project uses [Wails](https://wails.app) to build the desktop app. To
install Wails, follow the instruction on
its [Getting started](https://wails.app/gettingstarted/) page.

Be sure to have the following environment variables set:

- `CGO_ENABLED=1`
- `GO111MODULE=on`

```sh
go install github.com/wailsapp/wails/cmd/wails@v1.16.9
```

##### Common issues

###### Error: open HOME/.wails/wails.json no such file or directory

Before building the project for the first time, ensure you have run:

```sh
wails setup
```

#### Frontend

Make sure to have at least **Node v16.13.2** installed.

The supported version of Typescript is **4.3.5**.

### Build

Compile the project using the `build` command.

```sh
wails build -p
```

If all went well, you should have a compiled program in your `build` directory.
Go to the `build` directory and run the program with `./vegawallet-desktop` or
double click `vegawallet-desktop.exe` if on Windows.

More at the [Wails documentation](https://wails.app/reference/cli/#build).

### Serve

#### Backend

While developing your apps using wails the preferred method is by the `serve`
command:

```sh
wails serve
```

#### Frontend

Go to the `frontend` directory, and serve your GUI using:

```sh
npm run serve
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

Get API reference documentation, learn more about how Vega works, and explore
sample scripts for API trading

**[Wallet documentation](https://docs.vega.xyz/docs/tools/overview)**

Learn about how Vega interacts with wallets.

**[Nolt](https://vega-testnet.nolt.io/)**

Raise issues and see what others have raised.

**[Discord](https://vega.xyz/discord)**

Ask us for help, find out about scheduled open sessions, and keep up with Vega
generally.

## About Vega

[Vega][vega-website] is a protocol for creating and trading derivatives on a
fully decentralised network. The network, secured with proof-of-stake, will
facilitate fully automated, end-to-end margin trading and execution of complex
financial products. Anyone will be able to build decentralised markets using the
protocol.

Read more at [https://vega.xyz][vega-website].

[vega-website]: https://vega.xyz
