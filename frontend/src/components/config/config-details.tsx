import React from "react";
import {Config} from "../../models/config";

export interface ConfigDetailsProps {
    config: Config;
}

export const ConfigDetails = (props: ConfigDetailsProps): JSX.Element => {
    return (
        <div>
            <h2>Log level</h2>
            <p>{props.config.Level}</p>

            <h2>Token expiry</h2>
            <p>{props.config.TokenExpiry}</p>

            <h2>Host</h2>
            <p>{props.config.Host}</p>

            <h2>Port</h2>
            <p>{props.config.Port}</p>

            <h2>Nodes</h2>
            <h3>Retries</h3>
            <p>{props.config.Nodes.Retries}</p>
            <h3>Hosts</h3>
            <ul>
                {props.config.Nodes.Hosts.map(host =>
                    <li key={host}>{host}</li>
                )}
            </ul>

            <h2>Console</h2>
            <h3>URL</h3>
            <p>{props.config.Console.URL}</p>
            <h3>Local port</h3>
            <p>{props.config.Console.LocalPort}</p>
        </div>
    )
}
