import React from "react";
import {Config} from "../../models/config";

export interface ConfigDetailsProps {
    config: Config;
}

export const ConfigDetails = (props: ConfigDetailsProps): React.ReactElement => {
    return (
        <div>
            <h1>Log level</h1>
            <p>{props.config.Level}</p>

            <h1>Token expiry</h1>
            <p>{props.config.TokenExpiry}</p>

            <h1>Host</h1>
            <p>{props.config.Host}</p>

            <h1>Port</h1>
            <p>{props.config.Port}</p>

            <h1>Nodes</h1>
            <h2>Retries</h2>
            <p>{props.config.Nodes.Retries}</p>
            <h2>Hosts</h2>
            <ul>
                {props.config.Nodes.Hosts.every(host =>
                    <li>{host}</li>
                )}
            </ul>

            <h1>Console</h1>
            <h2>URL</h2>
            <p>{props.config.Console.URL}</p>
            <h2>Local port</h2>
            <p>{props.config.Console.LocalPort}</p>
        </div>
    )
}
