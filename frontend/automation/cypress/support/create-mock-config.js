const fs = require('fs')
const path = require('path')
const CONFIG = `Name = "custom"
Level = "info"
TokenExpiry = "168h0m0s"
Port = 1789
Host = "127.0.0.1"

[API]
  [API.GRPC]
    Hosts = []
    Retries = 5
  [API.REST]
    Hosts = []
  [API.GraphQL]
    Hosts = ["https://mock.vega.xyz/query"]

[TokenDApp]
  URL = "token.fairground.wtf"
  LocalPort = 1848

[Console]
  URL = "console.fairground.wtf"
  LocalPort = 1847
`
const DIR = './network-config'
const dirExists = fs.existsSync(DIR)
if (!dirExists) {
  fs.mkdirSync(DIR)
}
const result = path.join(DIR, '/custom.toml')
console.log(result)
fs.writeFileSync(result, CONFIG)
