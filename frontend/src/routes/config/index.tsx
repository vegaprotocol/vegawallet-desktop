import React from "react";

import {GetConfig} from "../../api/service";
import {Config} from "../../models/config";
import {ErrorMessage} from "../../components/error-message";
import {ConfigEditor} from "../../components/config/config-editor";
import {Link} from "react-router-dom";

const EditServiceConfig = () => {
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const [config, setConfig] = React.useState<Config | null>(null);

    React.useEffect(() => {
        GetConfig()
            .then(result => setConfig(result))
            .catch(error => setErrorMessage(error));
    }, [])

    return (
        <div>
            <h1>Edit configuration <Link to="/">(back)</Link></h1>
            <hr/>
            {config !== null
                ? <ConfigEditor config={config}/>
                : <ErrorMessage message={errorMessage}/>
            }
        </div>
    );
};

export default EditServiceConfig;
