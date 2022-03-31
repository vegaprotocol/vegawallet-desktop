// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
window.wailsbindings = {"backend":{"Handler":{"AnnotateKey":{"name":"backend.Handler.AnnotateKey","inputs":[{"type":"*wallet.AnnotateKeyRequest"}],"outputs":[{"type":"error"}]},"CheckVersion":{"name":"backend.Handler.CheckVersion","outputs":[{"type":"*backend.CheckVersionResponse"},{"type":"error"}]},"ConsentPendingTransaction":{"name":"backend.Handler.ConsentPendingTransaction","inputs":[{"type":"*backend.ConsentPendingTransactionRequest"}],"outputs":[{"type":"error"}]},"CreateWallet":{"name":"backend.Handler.CreateWallet","inputs":[{"type":"*wallet.CreateWalletRequest"}],"outputs":[{"type":"*wallet.CreateWalletResponse"},{"type":"error"}]},"DeleteWallet":{"name":"backend.Handler.DeleteWallet","inputs":[{"type":"*backend.DeleteWalletRequest"}],"outputs":[{"type":"error"}]},"DescribeKey":{"name":"backend.Handler.DescribeKey","inputs":[{"type":"*wallet.DescribeKeyRequest"}],"outputs":[{"type":"*wallet.DescribeKeyResponse"},{"type":"error"}]},"GenerateKey":{"name":"backend.Handler.GenerateKey","inputs":[{"type":"*wallet.GenerateKeyRequest"}],"outputs":[{"type":"*wallet.GenerateKeyResponse"},{"type":"error"}]},"GetAppConfig":{"name":"backend.Handler.GetAppConfig","outputs":[{"type":"config.Config"},{"type":"error"}]},"GetConsoleState":{"name":"backend.Handler.GetConsoleState","outputs":[{"type":"backend.GetServiceStateResponse"}]},"GetNetworkConfig":{"name":"backend.Handler.GetNetworkConfig","inputs":[{"type":"string"}],"outputs":[{"type":"*network.Network"},{"type":"error"}]},"GetPendingTransaction":{"name":"backend.Handler.GetPendingTransaction","inputs":[{"type":"*backend.GetPendingTransactionRequest"}],"outputs":[{"type":"*backend.PendingTransaction"},{"type":"error"}]},"GetPendingTransactions":{"name":"backend.Handler.GetPendingTransactions","outputs":[{"type":"*backend.GetPendingTransactionsResponse"}]},"GetServiceState":{"name":"backend.Handler.GetServiceState","outputs":[{"type":"backend.GetServiceStateResponse"}]},"GetTokenDAppState":{"name":"backend.Handler.GetTokenDAppState","outputs":[{"type":"backend.GetServiceStateResponse"}]},"GetVersion":{"name":"backend.Handler.GetVersion","outputs":[{"type":"*backend.GetVersionResponse"}]},"ImportNetwork":{"name":"backend.Handler.ImportNetwork","inputs":[{"type":"*network.ImportNetworkFromSourceRequest"}],"outputs":[{"type":"*network.ImportNetworkFromSourceResponse"},{"type":"error"}]},"ImportWallet":{"name":"backend.Handler.ImportWallet","inputs":[{"type":"*wallet.ImportWalletRequest"}],"outputs":[{"type":"*wallet.ImportWalletResponse"},{"type":"error"}]},"InitialiseApp":{"name":"backend.Handler.InitialiseApp","inputs":[{"type":"*backend.InitialiseAppRequest"}],"outputs":[{"type":"error"}]},"IsAppInitialised":{"name":"backend.Handler.IsAppInitialised","outputs":[{"type":"bool"},{"type":"error"}]},"IsolateKey":{"name":"backend.Handler.IsolateKey","inputs":[{"type":"*wallet.IsolateKeyRequest"}],"outputs":[{"type":"*wallet.IsolateKeyResponse"},{"type":"error"}]},"ListKeys":{"name":"backend.Handler.ListKeys","inputs":[{"type":"*wallet.ListKeysRequest"}],"outputs":[{"type":"*wallet.ListKeysResponse"},{"type":"error"}]},"ListNetworks":{"name":"backend.Handler.ListNetworks","outputs":[{"type":"*network.ListNetworksResponse"},{"type":"error"}]},"ListWallets":{"name":"backend.Handler.ListWallets","outputs":[{"type":"*wallet.ListWalletsResponse"},{"type":"error"}]},"SaveNetworkConfig":{"name":"backend.Handler.SaveNetworkConfig","inputs":[{"type":"*network.Network"}],"outputs":[{"type":"bool"},{"type":"error"}]},"SearchForExistingConfiguration":{"name":"backend.Handler.SearchForExistingConfiguration","outputs":[{"type":"*backend.SearchForExistingConfigurationResponse"},{"type":"error"}]},"SignMessage":{"name":"backend.Handler.SignMessage","inputs":[{"type":"*wallet.SignMessageRequest"}],"outputs":[{"type":"*wallet.SignMessageResponse"},{"type":"error"}]},"StartConsole":{"name":"backend.Handler.StartConsole","inputs":[{"type":"*backend.StartServiceRequest"}],"outputs":[{"type":"bool"},{"type":"error"}]},"StartService":{"name":"backend.Handler.StartService","inputs":[{"type":"*backend.StartServiceRequest"}],"outputs":[{"type":"bool"},{"type":"error"}]},"StartTokenDApp":{"name":"backend.Handler.StartTokenDApp","inputs":[{"type":"*backend.StartServiceRequest"}],"outputs":[{"type":"bool"},{"type":"error"}]},"StopConsole":{"name":"backend.Handler.StopConsole","outputs":[{"type":"bool"},{"type":"error"}]},"StopService":{"name":"backend.Handler.StopService","outputs":[{"type":"bool"},{"type":"error"}]},"StopTokenDApp":{"name":"backend.Handler.StopTokenDApp","outputs":[{"type":"bool"},{"type":"error"}]},"TaintKey":{"name":"backend.Handler.TaintKey","inputs":[{"type":"*wallet.TaintKeyRequest"}],"outputs":[{"type":"error"}]},"UntaintKey":{"name":"backend.Handler.UntaintKey","inputs":[{"type":"*wallet.UntaintKeyRequest"}],"outputs":[{"type":"error"}]},"UpdateAppConfig":{"name":"backend.Handler.UpdateAppConfig","inputs":[{"type":"*config.Config"}],"outputs":[{"type":"error"}]}}}};
const go = {
  "backend": {
    "Handler": {
      /**
       * AnnotateKey
       * @param {AnnotateKeyRequest} arg1 - Go Type: *wallet.AnnotateKeyRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "AnnotateKey": (arg1) => {
        return window.go.backend.Handler.AnnotateKey(arg1);
      },
      /**
       * CheckVersion
       * @returns {Promise<CheckVersionResponse|Error>}  - Go Type: *backend.CheckVersionResponse
       */
      "CheckVersion": () => {
        return window.go.backend.Handler.CheckVersion();
      },
      /**
       * ConsentPendingTransaction
       * @param {ConsentPendingTransactionRequest} arg1 - Go Type: *backend.ConsentPendingTransactionRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "ConsentPendingTransaction": (arg1) => {
        return window.go.backend.Handler.ConsentPendingTransaction(arg1);
      },
      /**
       * CreateWallet
       * @param {CreateWalletRequest} arg1 - Go Type: *wallet.CreateWalletRequest
       * @returns {Promise<CreateWalletResponse|Error>}  - Go Type: *wallet.CreateWalletResponse
       */
      "CreateWallet": (arg1) => {
        return window.go.backend.Handler.CreateWallet(arg1);
      },
      /**
       * DeleteWallet
       * @param {DeleteWalletRequest} arg1 - Go Type: *backend.DeleteWalletRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "DeleteWallet": (arg1) => {
        return window.go.backend.Handler.DeleteWallet(arg1);
      },
      /**
       * DescribeKey
       * @param {DescribeKeyRequest} arg1 - Go Type: *wallet.DescribeKeyRequest
       * @returns {Promise<DescribeKeyResponse|Error>}  - Go Type: *wallet.DescribeKeyResponse
       */
      "DescribeKey": (arg1) => {
        return window.go.backend.Handler.DescribeKey(arg1);
      },
      /**
       * GenerateKey
       * @param {GenerateKeyRequest} arg1 - Go Type: *wallet.GenerateKeyRequest
       * @returns {Promise<GenerateKeyResponse|Error>}  - Go Type: *wallet.GenerateKeyResponse
       */
      "GenerateKey": (arg1) => {
        return window.go.backend.Handler.GenerateKey(arg1);
      },
      /**
       * GetAppConfig
       * @returns {Promise<Config|Error>}  - Go Type: config.Config
       */
      "GetAppConfig": () => {
        return window.go.backend.Handler.GetAppConfig();
      },
      /**
       * GetConsoleState
       * @returns {Promise<GetServiceStateResponse>}  - Go Type: backend.GetServiceStateResponse
       */
      "GetConsoleState": () => {
        return window.go.backend.Handler.GetConsoleState();
      },
      /**
       * GetNetworkConfig
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<Network|Error>}  - Go Type: *network.Network
       */
      "GetNetworkConfig": (arg1) => {
        return window.go.backend.Handler.GetNetworkConfig(arg1);
      },
      /**
       * GetPendingTransaction
       * @param {GetPendingTransactionRequest} arg1 - Go Type: *backend.GetPendingTransactionRequest
       * @returns {Promise<PendingTransaction|Error>}  - Go Type: *backend.PendingTransaction
       */
      "GetPendingTransaction": (arg1) => {
        return window.go.backend.Handler.GetPendingTransaction(arg1);
      },
      /**
       * GetPendingTransactions
       * @returns {Promise<GetPendingTransactionsResponse>}  - Go Type: *backend.GetPendingTransactionsResponse
       */
      "GetPendingTransactions": () => {
        return window.go.backend.Handler.GetPendingTransactions();
      },
      /**
       * GetServiceState
       * @returns {Promise<GetServiceStateResponse>}  - Go Type: backend.GetServiceStateResponse
       */
      "GetServiceState": () => {
        return window.go.backend.Handler.GetServiceState();
      },
      /**
       * GetTokenDAppState
       * @returns {Promise<GetServiceStateResponse>}  - Go Type: backend.GetServiceStateResponse
       */
      "GetTokenDAppState": () => {
        return window.go.backend.Handler.GetTokenDAppState();
      },
      /**
       * GetVersion
       * @returns {Promise<GetVersionResponse>}  - Go Type: *backend.GetVersionResponse
       */
      "GetVersion": () => {
        return window.go.backend.Handler.GetVersion();
      },
      /**
       * ImportNetwork
       * @param {ImportNetworkFromSourceRequest} arg1 - Go Type: *network.ImportNetworkFromSourceRequest
       * @returns {Promise<ImportNetworkFromSourceResponse|Error>}  - Go Type: *network.ImportNetworkFromSourceResponse
       */
      "ImportNetwork": (arg1) => {
        return window.go.backend.Handler.ImportNetwork(arg1);
      },
      /**
       * ImportWallet
       * @param {ImportWalletRequest} arg1 - Go Type: *wallet.ImportWalletRequest
       * @returns {Promise<ImportWalletResponse|Error>}  - Go Type: *wallet.ImportWalletResponse
       */
      "ImportWallet": (arg1) => {
        return window.go.backend.Handler.ImportWallet(arg1);
      },
      /**
       * InitialiseApp
       * @param {InitialiseAppRequest} arg1 - Go Type: *backend.InitialiseAppRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "InitialiseApp": (arg1) => {
        return window.go.backend.Handler.InitialiseApp(arg1);
      },
      /**
       * IsAppInitialised
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "IsAppInitialised": () => {
        return window.go.backend.Handler.IsAppInitialised();
      },
      /**
       * IsolateKey
       * @param {IsolateKeyRequest} arg1 - Go Type: *wallet.IsolateKeyRequest
       * @returns {Promise<IsolateKeyResponse|Error>}  - Go Type: *wallet.IsolateKeyResponse
       */
      "IsolateKey": (arg1) => {
        return window.go.backend.Handler.IsolateKey(arg1);
      },
      /**
       * ListKeys
       * @param {ListKeysRequest} arg1 - Go Type: *wallet.ListKeysRequest
       * @returns {Promise<ListKeysResponse|Error>}  - Go Type: *wallet.ListKeysResponse
       */
      "ListKeys": (arg1) => {
        return window.go.backend.Handler.ListKeys(arg1);
      },
      /**
       * ListNetworks
       * @returns {Promise<ListNetworksResponse|Error>}  - Go Type: *network.ListNetworksResponse
       */
      "ListNetworks": () => {
        return window.go.backend.Handler.ListNetworks();
      },
      /**
       * ListWallets
       * @returns {Promise<ListWalletsResponse|Error>}  - Go Type: *wallet.ListWalletsResponse
       */
      "ListWallets": () => {
        return window.go.backend.Handler.ListWallets();
      },
      /**
       * SaveNetworkConfig
       * @param {Network} arg1 - Go Type: *network.Network
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "SaveNetworkConfig": (arg1) => {
        return window.go.backend.Handler.SaveNetworkConfig(arg1);
      },
      /**
       * SearchForExistingConfiguration
       * @returns {Promise<SearchForExistingConfigurationResponse|Error>}  - Go Type: *backend.SearchForExistingConfigurationResponse
       */
      "SearchForExistingConfiguration": () => {
        return window.go.backend.Handler.SearchForExistingConfiguration();
      },
      /**
       * SignMessage
       * @param {SignMessageRequest} arg1 - Go Type: *wallet.SignMessageRequest
       * @returns {Promise<SignMessageResponse|Error>}  - Go Type: *wallet.SignMessageResponse
       */
      "SignMessage": (arg1) => {
        return window.go.backend.Handler.SignMessage(arg1);
      },
      /**
       * StartConsole
       * @param {StartServiceRequest} arg1 - Go Type: *backend.StartServiceRequest
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StartConsole": (arg1) => {
        return window.go.backend.Handler.StartConsole(arg1);
      },
      /**
       * StartService
       * @param {StartServiceRequest} arg1 - Go Type: *backend.StartServiceRequest
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StartService": (arg1) => {
        return window.go.backend.Handler.StartService(arg1);
      },
      /**
       * StartTokenDApp
       * @param {StartServiceRequest} arg1 - Go Type: *backend.StartServiceRequest
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StartTokenDApp": (arg1) => {
        return window.go.backend.Handler.StartTokenDApp(arg1);
      },
      /**
       * StopConsole
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StopConsole": () => {
        return window.go.backend.Handler.StopConsole();
      },
      /**
       * StopService
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StopService": () => {
        return window.go.backend.Handler.StopService();
      },
      /**
       * StopTokenDApp
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StopTokenDApp": () => {
        return window.go.backend.Handler.StopTokenDApp();
      },
      /**
       * TaintKey
       * @param {TaintKeyRequest} arg1 - Go Type: *wallet.TaintKeyRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "TaintKey": (arg1) => {
        return window.go.backend.Handler.TaintKey(arg1);
      },
      /**
       * UntaintKey
       * @param {UntaintKeyRequest} arg1 - Go Type: *wallet.UntaintKeyRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "UntaintKey": (arg1) => {
        return window.go.backend.Handler.UntaintKey(arg1);
      },
      /**
       * UpdateAppConfig
       * @param {Config} arg1 - Go Type: *config.Config
       * @returns {Promise<Error>}  - Go Type: error
       */
      "UpdateAppConfig": (arg1) => {
        return window.go.backend.Handler.UpdateAppConfig(arg1);
      },
    },
  },

};
export default go;
