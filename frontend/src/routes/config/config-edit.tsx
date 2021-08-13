import React from "react";
import { Config } from "../../models/config";
import { Link } from "react-router-dom";
import { ConfigEditor } from "./config-editor";

export const ConfigEdit = ({ config }: { config: Config }) => {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h1 style={{ margin: 0 }}>Edit configuration</h1>
        <Link to="/config">
          <button>Back</button>
        </Link>
      </header>
      <ConfigEditor config={config} />
    </>
  );
};
