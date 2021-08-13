import React from "react";

import { GetConfig } from "../../api/service";
import { Config as ConfigModel } from "../../models/config";
import { ConfigDetails } from "./config-details";
import { ErrorMessage } from "../../components/error-message";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { ConfigEdit } from "./config-edit";

export const Config = () => {
  const match = useRouteMatch();
  const [configErrorMessage, setConfigErrorMessage] = React.useState<
    string | null
  >(null);
  // const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  // const [successMessage, setSuccessMessage] = React.useState<string | null>(
  //   null
  // );
  const [config, setConfig] = React.useState<ConfigModel | null>(null);

  React.useEffect(() => {
    GetConfig()
      .then((result) => {
        setConfig(result);
      })
      .catch((error) => {
        setConfigErrorMessage(error);
      });
  }, []);

  // const startConsole = (e: any) => {
  //   e.preventDefault();
  //   setSuccessMessage("Starting console...");
  //   StartConsole()
  //     .then((success) => {
  //       if (success) {
  //         setErrorMessage(null);
  //         setSuccessMessage("Console successfully stopped...");
  //       }
  //     })
  //     .catch((error) => {
  //       setSuccessMessage(null);
  //       setErrorMessage(`Error: ${error}`);
  //     });
  // };

  // const stopConsole = (e: any) => {
  //   e.preventDefault();
  //   StopConsole()
  //     .then((success) => {
  //       if (success) {
  //         setErrorMessage(null);
  //         setSuccessMessage("Stopping console...");
  //       }
  //     })
  //     .catch((error) => {
  //       setSuccessMessage(null);
  //       setErrorMessage(`Error: ${error}`);
  //     });
  // };

  if (!config) {
    return <ErrorMessage message={configErrorMessage} />;
  }

  return (
    <Switch>
      <Route path={match.path} exact={true}>
        <ConfigDetails config={config} />
      </Route>
      <Route path={`${match.path}/edit`}>
        <ConfigEdit config={config} />
      </Route>
    </Switch>
  );
};
