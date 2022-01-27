import React from 'react'
import { Header } from '../../components/bullet-header'
import { ExternalLink } from '../../components/external-link'
import { NetworkConfigContainer } from './network-config-container'

export const NetworkDetails = () => {
  return (
    <NetworkConfigContainer>
      {config => (
        <>
          <Header>Network: {config.Name}</Header>
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
                  <ExternalLink
                    style={{ textDecoration: 'underline' }}
                    href={`https://${config.Console.URL}`}
                  >
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
      )}
    </NetworkConfigContainer>
  )
}

interface NodeListProps {
  items: string[]
}

function NodeList({ items }: NodeListProps) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 5 }} className='text-muted'>
          {item}
        </li>
      ))}
    </ul>
  )
}
