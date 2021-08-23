import "./chrome.scss";
import React from "react";
import { Link } from "react-router-dom";
import { Vega } from "../icons";
import routerConfig from "../../routes/router-config";

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="chrome">
      <div className="chrome__topbar">
        <Link to="/" style={{ marginLeft: -8 }}>
          <Vega style={{ display: "block", width: 30, height: 30 }} />
        </Link>
        <nav className="chrome__nav">
          {routerConfig
            .filter((route) => {
              if (route.name === "Home") return false;
              return true;
            })
            .map((route, i) => (
              <span key={route.name}>
                {i !== 0 ? " / " : null}
                <Link to={route.path}>{route.name}</Link>
              </span>
            ))}
        </nav>
      </div>
      <main className="chrome__main">{children}</main>
    </div>
  );
}
