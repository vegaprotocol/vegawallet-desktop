# desktop-wallet

desktop-wallet is a graphical implementation of Vega
Protocol's [wallet](https://github.com/vegaprotocol/go-wallet/).

## Development

### Dependencies

This project uses [Wails](https://wails.app) to build the desktop app. To
install Wails, follow the instruction on
its [Getting started](https://wails.app/gettingstarted/) page.

Be sure to have the following environment variables set:

* `CGO_ENABLED=1`
* `GO111MODULE=on`

```sh
go install github.com/wailsapp/wails/cmd/wails@v1.16.5
```

### Build

Compile the project using the `build` command.

```sh
wails build -p
```

If all went well, you should have a compiled program in your `build` directory.
Go to the `build` directory and run the program with `./desktop-wallet` or
double click `desktop-wallet.exe` if on Windows.

More at the [Wails documentation](https://wails.app/reference/cli/#build).

### Serve

While developing your apps using wails the preferred method is by the `serve`
command:

```sh
wails serve
```

Then, go to the `frontend` directory, and serve your GUI using:

```sh
npm run serve
```

## Support

**[Documentation](https://docs.fairground.vega.xyz)**

Get API reference documentation, learn more about how Vega works, and explore
sample scripts for API trading

**[Wallet documentation](https://docs.fairground.vega.xyz/docs/wallet/)**

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
