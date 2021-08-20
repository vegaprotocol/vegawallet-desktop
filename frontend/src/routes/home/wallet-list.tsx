import React from "react";
import {ListWallets} from "../../api/service";
import {AppToaster} from "../../components/toaster";
import {Colors} from "../../config/colors";
import {ListWalletsResponse} from "../../models/list-wallets";

export const WalletList = () => {
  const [response, setResponse] = React.useState<ListWalletsResponse>(new ListWalletsResponse());

  React.useEffect(() => {
    ListWallets()
      .then((result) => {
        setResponse(result);
      })
      .catch((error) => {
        AppToaster.show({message: `Error: ${error}`, color: Colors.RED});
      });
  }, []);

  return (
    <ul>
      {response.Wallets.map((wallet) => (
        <li key={wallet} style={{marginBottom: 5}}>
          {wallet}
        </li>
      ))}
    </ul>
  );
};
