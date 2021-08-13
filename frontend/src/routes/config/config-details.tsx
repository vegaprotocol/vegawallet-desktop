import React from "react";
import { Link } from "react-router-dom";
import { Config } from "../../models/config";

export interface ConfigDetailsProps {
  config: Config;
}

export const ConfigDetails = (props: ConfigDetailsProps): JSX.Element => {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h1 style={{ margin: 0 }}>Config</h1>
        <Link to="/config/edit">
          <button>Edit</button>
        </Link>
      </header>
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
      <h2>Nodes</h2>
      <table>
        <tbody>
          <tr>
            <th>Retires</th>
            <td>{props.config.Nodes.Retries}</td>
          </tr>
        </tbody>
      </table>
      <h2>Console</h2>
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
      <h2>Hosts</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {props.config.Nodes.Hosts.map((host) => (
          <li key={host} style={{ borderTop: "1px solid white", padding: 5 }}>
            {host}
          </li>
        ))}
      </ul>
    </>
  );
};
