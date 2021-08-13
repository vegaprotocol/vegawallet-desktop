import React from "react";
import { Route, Switch } from "react-router-dom";
import { Loading } from "../components/loading";
import routerConfig from "./router-config";

export const AppRouter = () => {
  return (
    <Switch>
      <React.Suspense fallback={<Loading />}>
        {routerConfig.map(
          ({ path, component: Component, exact = false, name }) => (
            <Route key={name} path={path} exact={exact}>
              <Component />
            </Route>
          )
        )}
      </React.Suspense>
    </Switch>
  );
};
