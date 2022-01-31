import React from 'react'
import { useNetwork } from '../../contexts/network/network-context'
import { ExternalLink } from '../external-link'
import { NodeList } from '../node-list'

export function NetworkInfo() {
  const {
    state: { config }
  } = useNetwork()

  if (!config) {
    return null
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{config.Name}</td>
          </tr>
          <tr>
            <th>Log level</th>
            <td>{config.Level}</td>
          </tr>
          <tr>
            <th>Token expiry</th>
            <td>{config.TokenExpiry}</td>
          </tr>
          <tr>
            <th>Host</th>
            <td>{config.Host}</td>
          </tr>
          <tr>
            <th>Port</th>
            <td>{config.Port}</td>
          </tr>
        </tbody>
      </table>
      <h2>Console</h2>
      <table>
        <tbody>
          <tr>
            <th>URL</th>
            <td>
              <ExternalLink href={`https://${config.Console.URL}`}>
                {config.Console.URL}
              </ExternalLink>
            </td>
          </tr>
          <tr>
            <th>Local port</th>
            <td>{config.Console.LocalPort}</td>
          </tr>
        </tbody>
      </table>
      <h2>gRPC Nodes</h2>
      <NodeList items={config.API.GRPC.Hosts} />
      <h2>GraphQL Nodes</h2>
      <NodeList items={config.API.GraphQL.Hosts} />
      <h2>REST Nodes</h2>
      <NodeList items={config.API.REST.Hosts} />
    </>
  )
}
