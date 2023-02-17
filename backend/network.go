package backend

var DefaultNetworks = []DefaultNetwork{
	{
		Name: "mainnet1",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml",
	}, {
		Name: "testnet2",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks/master/testnet2/testnet2.toml",
	}, {
		Name: "fairground",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml",
	},
}

type DefaultNetwork struct {
	Name string
	URL  string
}
