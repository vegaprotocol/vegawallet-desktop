import React from "react";
import { Route, Switch } from "react-router-dom";
import routerConfig from "./router-config";

export const AppRouter = () => {
  return (
    <Switch>
      {routerConfig.map(({ path, component: Component, exact, name }) => {
        return (
          <Route key={name} path={path} exact={exact}>
            <Component />
          </Route>
        );
      })}
    </Switch>
  );
};
