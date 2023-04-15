//go:build mainnet

package backend

var DefaultNetworks = []DefaultNetwork{
	{
		Name: "mainnet1",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml",
	},
}
