import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { BulletHeader } from "../../components/bullet-header";
import { ButtonGroup } from "../../components/button-group";

export function ImportSelect() {
  const match = useRouteMatch();
  return (
    <>
      <BulletHeader tag="h1">Create or import wallet</BulletHeader>

      <ButtonGroup>
        <Link to={`${match.path}/create`}>
          <button className="fill">Create new</button>
        </Link>
        <Link to={`${match.path}/path`}>
          <button className="fill">Import by path</button>
        </Link>
        <Link to={`${match.path}/mnemonic`}>
          <button className="fill">Import by mnemonic</button>
        </Link>
      </ButtonGroup>
    </>
  );
}
