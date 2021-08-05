import React from "react";

import {GetConfig} from "../../api/service";
import {Config} from "../../models/config";
import {ConfigDetails} from "../../components/config/config-details";

const Home = () => {
    const [config, setConfig] = React.useState<Config | null>(null);

    React.useEffect(() => {
        GetConfig().then(result => setConfig(result))
    }, [])

    return (
        <div>
            <h1>Config</h1>
            {config !== null
                ? <ConfigDetails config={config}/>
                : <p>No configuration</p>
            }
        </div>
    );
};

export default Home;
