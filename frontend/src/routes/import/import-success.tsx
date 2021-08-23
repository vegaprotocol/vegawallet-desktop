import React from "react";
import { Link } from "react-router-dom";

export function ImportSuccess() {
  return (
    <>
      <p>Wallet successfully imported</p>
      <Link to="/">
        <button>Go to wallets</button>
      </Link>
    </>
  );
}
