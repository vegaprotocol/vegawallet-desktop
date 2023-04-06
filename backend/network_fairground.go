//go:build fairground

package backend

var DefaultNetworks = []DefaultNetwork{
	{
		Name: "testnet2",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks/master/testnet2/testnet2.toml",
	}, {
		Name: "fairground",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml",
	},
}
