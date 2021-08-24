import React from 'react'
import { Link } from 'react-router-dom'

import { BulletHeader } from '../../components/bullet-header'
import type { Config } from '../../models/config'

export interface ConfigDetailsProps {
  config: Config
}

export const ConfigDetails = (props: ConfigDetailsProps): JSX.Element => {
  return (
    <>
      <BulletHeader tag='h1'>
        Config / <Link to='/config/edit'>Edit</Link>
      </BulletHeader>
      <table>
        <tbody>
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
          <tr></tr>
        </tbody>
      </table>
      <BulletHeader tag='h2'>Nodes</BulletHeader>
      <table>
        <tbody>
          <tr>
            <th>Retires</th>
            <td>{props.config.Nodes.Retries}</td>
          </tr>
        </tbody>
      </table>
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
      <BulletHeader tag='h2'>Hosts</BulletHeader>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {props.config.Nodes.Hosts.map(host => (
          <li key={host} style={{ marginBottom: 5 }}>
            {host}
          </li>
        ))}
      </ul>
    </>
  )
}
