import React from "react";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { BulletHeader } from "../../components/bullet-header";
import { ButtonGroup } from "../../components/button-group";

export function ImportSelect() {
  const match = useRouteMatch();
  const location = useLocation();
  return (
    <>
      <BulletHeader tag="h1">Create or import wallet</BulletHeader>
      <ButtonGroup>
        {[
          { path: `${match.path}/create`, text: "Create new" },
          { path: `${match.path}/path`, text: "Import by path" },
          { path: `${match.path}/mnemonic`, text: "Import by mnemonic" },
        ].map((route) => {
          const isActive = location.pathname === route.path;
          const className = ["fill", isActive ? "active" : ""].join(" ");
          return (
            <Link to={route.path} key={route.path}>
              <button className={className}>{route.text}</button>
            </Link>
          );
        })}
      </ButtonGroup>
    </>
  );
}
