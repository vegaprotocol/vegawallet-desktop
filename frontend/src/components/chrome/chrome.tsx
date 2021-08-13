import React from "react";
import { Link } from "react-router-dom";
import { Vega } from "../icons";

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid white",
          padding: "0 15px 0 8px",
          height: 50,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Link to="/">
          <Vega style={{ display: "block", width: 30, height: 30 }} />
        </Link>
        <Link to="/config">
          <button>Config</button>
        </Link>
      </div>
      <main style={{ padding: 15, maxWidth: 600, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
