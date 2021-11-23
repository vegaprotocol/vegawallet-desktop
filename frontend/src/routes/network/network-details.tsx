import React from 'react'
import { Link } from 'react-router-dom'

import { BulletHeader } from '../../components/bullet-header'
import type { Network } from '../../models/network'

export interface NetworkDetailsProps {
  config: Network
}

export const NetworkDetails = (props: NetworkDetailsProps): JSX.Element => {
  return (
    <>
      <BulletHeader tag='h1'>
        Config / <Link to='/network/edit'>Edit</Link>
      </BulletHeader>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{props.config.Name}</td>
          </tr>
          <tr>
            <th>Log level</th>
            <td>{props.config.Level}</td>
          </tr>
          <tr>
            <th>Token expiry</th>
            <td>{props.config.TokenExpiry}</td>
          </tr>
          <tr>
            <th>Host</th>
            <td>{props.config.Host}</td>
          </tr>
          <tr>
            <th>Port</th>
            <td>{props.config.Port}</td>
          </tr>
        </tbody>
      </table>
      <BulletHeader tag='h2'>gRPC Nodes</BulletHeader>
      <table>
        <tbody>
          <tr>
            <th>Retries</th>
            <td>{props.config.API.GRPC.Retries}</td>
          </tr>
        </tbody>
      </table>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {props.config.API.GRPC.Hosts.map(host => (
          <li key={host} style={{ marginBottom: 5 }}>
            {host}
          </li>
        ))}
      </ul>
      <BulletHeader tag='h2'>GraphQL Nodes</BulletHeader>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {props.config.API.GraphQL.Hosts.map(host => (
          <li key={host} style={{ marginBottom: 5 }}>
            {host}
          </li>
        ))}
      </ul>
      <BulletHeader tag='h2'>REST Nodes</BulletHeader>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {props.config.API.REST.Hosts.map(host => (
          <li key={host} style={{ marginBottom: 5 }}>
            {host}
          </li>
        ))}
      </ul>
      <BulletHeader tag='h2'>Console</BulletHeader>
      <table>
        <tbody>
          <tr>
            <th>URL</th>
            <td>
              <a href={`https://${props.config.Console.URL}`}>
                {props.config.Console.URL}
              </a>
            </td>
          </tr>
          <tr>
            <th>Local port</th>
            <td>{props.config.Console.LocalPort}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
