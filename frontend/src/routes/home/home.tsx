import React from "react";
import {IsAppInitialised} from "../../api/service";
import {WalletsLoader} from "./wallets-loader";
import {WalletList} from "./wallet-list";

export const Home = () => {
  const [isInit, setIsInit] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    IsAppInitialised()
      .then((result) => {
        setIsInit(result);
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);

  return (
    <div>
      <b>Is app initialised? {isInit ? "Yes" : "No"}</b>
      <WalletsLoader request={{RootPath: ""}}/>
      <WalletList/>
    </div>
  );
};
