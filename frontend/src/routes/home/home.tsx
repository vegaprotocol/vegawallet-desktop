import React from "react";
import { IsAppInitialised, ListWallets } from "../../api/service";
import { WalletList } from "./wallet-list";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Wallet } from "./wallet";

enum WalletStatus {
  Pending,
  Ready,
  None,
}

export const Home = () => {
  const [walletStatus, setWalletStatus] = React.useState(WalletStatus.Pending);
  const [wallets, setWallets] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function run() {
      try {
        const isInit = await IsAppInitialised();

        if (!isInit) {
          setWalletStatus(WalletStatus.None);
          return;
        }

        const wallets = await ListWallets();
        setWallets(wallets.Wallets);
        setWalletStatus(WalletStatus.Ready);
      } catch (err) {
        console.log(err);
        setWalletStatus(WalletStatus.None);
      }
    }

    run();
  }, []);

  if (walletStatus === WalletStatus.Pending) {
    return null;
  }

  if (walletStatus === WalletStatus.None) {
    return <Redirect to="/import" />;
  }

  return (
    <Switch>
      <Route path="/wallet/:wallet">
        <Wallet />
      </Route>
      <Route path="/" exact>
        <WalletList wallets={wallets} />
      </Route>
    </Switch>
  );

  // <b>Is app initialised? {isInit ? "Yes" : "No"}</b>
  // <hr/>
  // <WalletsLoader request={{RootPath: ""}}/>
  // <hr/>
  // <WalletImporter request={{RootPath: "", Name: "", Passphrase: "", Mnemonic: ""}}/>
  // <hr/>
  // <WalletList/>
  // <hr/>
};
