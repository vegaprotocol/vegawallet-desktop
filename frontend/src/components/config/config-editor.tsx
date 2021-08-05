import React from "react";
import {Config} from "../../models/config";
import {SaveConfig} from "../../api/service";
import {ErrorMessage} from "../error-message";
import {SuccessMessage} from "../success-message";

export interface ConfigDetailsProps {
    config: Config;
}

export const ConfigEditor = (props: ConfigDetailsProps): JSX.Element => {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [config, setConfig] = React.useState<string>(JSON.stringify(props.config, null, '    '))

    const handleConfig = (e: React.ChangeEvent<HTMLTextAreaElement>): void => setConfig(e.target.value)

    const handleSubmit = (evt: any) => {
        evt.preventDefault();
        SaveConfig(config)
            .then(success => {
                if (success) {
                    setErrorMessage(null)
                    setSuccessMessage("Configuration saved!");
                }
            })
            .catch(error => {
                setSuccessMessage(null)
                setErrorMessage(`Error: ${error}`);
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="config">Configuration</label><br/>
            <textarea id="config" name="config" rows={20} cols={80} value={config} onChange={handleConfig}/><br/>
            <input type="submit" value="Submit"/>
            <ErrorMessage message={errorMessage}/>
            <SuccessMessage message={successMessage}/>
        </form>
    )
}
