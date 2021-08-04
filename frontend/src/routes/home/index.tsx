import React from "react";

import {GetConfig, StartConsole, StopConsole} from "../../api/service";
import {Config} from "../../models/config";
import {ConfigDetails} from "../../components/config/config-details";
import {ErrorMessage} from "../../components/error-message";
import {Link} from "react-router-dom";
import {SuccessMessage} from "../../components/success-message";

const Home = () => {
    const [configErrorMessage, setConfigErrorMessage] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [config, setConfig] = React.useState<Config | null>(null);

    React.useEffect(() => {
        GetConfig()
            .then(result => setConfig(result))
            .catch(error => setConfigErrorMessage(error));
    }, [])

    const startConsole = (e: any) => {
        e.preventDefault();
        setSuccessMessage("Starting console...");
        StartConsole()
            .then(success => {
                if (success) {
                    setErrorMessage(null)
                    setSuccessMessage("Console successfully stopped...");
                }
            })
            .catch(error => {
                setSuccessMessage(null)
                setErrorMessage(`Error: ${error}`);
            });
    }

    const stopConsole = (e: any) => {
        e.preventDefault();
        StopConsole()
            .then(success => {
                if (success) {
                    setErrorMessage(null)
                    setSuccessMessage("Stopping console...");
                }
            })
            .catch(error => {
                setSuccessMessage(null)
                setErrorMessage(`Error: ${error}`);
            });
    }

    return (
        <div>
            <h1>Config <Link to="/service/config/edit">(edit)</Link></h1>
            <hr/>
            <ErrorMessage message={errorMessage}/>
            <SuccessMessage message={successMessage}/>

            <button onClick={startConsole}>
                Start console
            </button>

            <button onClick={stopConsole}>
                Stop console
            </button>

            <br/>

            {config !== null
                ? <ConfigDetails config={config}/>
                : <ErrorMessage message={configErrorMessage}/>
            }
        </div>
    );
};

export default Home;
