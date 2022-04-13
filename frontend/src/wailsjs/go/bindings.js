// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
const go = {
  "backend": {
    "Handler": {
      /**
       * AnnotateKey
       * @param {models.AnnotateKeyRequest} arg1 - Go Type: *wallet.AnnotateKeyRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "AnnotateKey": (arg1) => {
        return window.go.backend.Handler.AnnotateKey(arg1);
      },
      /**
       * CheckVersion
       * @returns {Promise<models.CheckVersionResponse|Error>}  - Go Type: *backend.CheckVersionResponse
       */
      "CheckVersion": () => {
        return window.go.backend.Handler.CheckVersion();
      },
      /**
       * ClearApprovedTransaction
       * @param {models.ClearApprovedTransactionRequest} arg1 - Go Type: *backend.ClearApprovedTransactionRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "ClearApprovedTransaction": (arg1) => {
        return window.go.backend.Handler.ClearApprovedTransaction(arg1);
      },
      /**
       * ConsentPendingTransaction
       * @param {models.ConsentPendingTransactionRequest} arg1 - Go Type: *backend.ConsentPendingTransactionRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "ConsentPendingTransaction": (arg1) => {
        return window.go.backend.Handler.ConsentPendingTransaction(arg1);
      },
      /**
       * CreateWallet
       * @param {models.CreateWalletRequest} arg1 - Go Type: *wallet.CreateWalletRequest
       * @returns {Promise<models.CreateWalletResponse|Error>}  - Go Type: *wallet.CreateWalletResponse
       */
      "CreateWallet": (arg1) => {
        return window.go.backend.Handler.CreateWallet(arg1);
      },
      /**
       * DeleteWallet
       * @param {models.DeleteWalletRequest} arg1 - Go Type: *backend.DeleteWalletRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "DeleteWallet": (arg1) => {
        return window.go.backend.Handler.DeleteWallet(arg1);
      },
      /**
       * DescribeKey
       * @param {models.DescribeKeyRequest} arg1 - Go Type: *wallet.DescribeKeyRequest
       * @returns {Promise<models.DescribeKeyResponse|Error>}  - Go Type: *wallet.DescribeKeyResponse
       */
      "DescribeKey": (arg1) => {
        return window.go.backend.Handler.DescribeKey(arg1);
      },
      /**
       * GenerateKey
       * @param {models.GenerateKeyRequest} arg1 - Go Type: *wallet.GenerateKeyRequest
       * @returns {Promise<models.GenerateKeyResponse|Error>}  - Go Type: *wallet.GenerateKeyResponse
       */
      "GenerateKey": (arg1) => {
        return window.go.backend.Handler.GenerateKey(arg1);
      },
      /**
       * GetAppConfig
       * @returns {Promise<models.Config|Error>}  - Go Type: config.Config
       */
      "GetAppConfig": () => {
        return window.go.backend.Handler.GetAppConfig();
      },
      /**
       * GetApprovedTransactions
       * @returns {Promise<models.GetApprovedTransactionsResponse|Error>}  - Go Type: *backend.GetApprovedTransactionsResponse
       */
      "GetApprovedTransactions": () => {
        return window.go.backend.Handler.GetApprovedTransactions();
      },
      /**
       * GetConsoleState
       * @returns {Promise<models.GetServiceStateResponse>}  - Go Type: backend.GetServiceStateResponse
       */
      "GetConsoleState": () => {
        return window.go.backend.Handler.GetConsoleState();
      },
      /**
       * GetNetworkConfig
       * @param {string} arg1 - Go Type: string
       * @returns {Promise<models.Network|Error>}  - Go Type: *network.Network
       */
      "GetNetworkConfig": (arg1) => {
        return window.go.backend.Handler.GetNetworkConfig(arg1);
      },
      /**
       * GetPendingTransaction
       * @param {models.GetPendingTransactionRequest} arg1 - Go Type: *backend.GetPendingTransactionRequest
       * @returns {Promise<models.PendingTransaction|Error>}  - Go Type: *backend.PendingTransaction
       */
      "GetPendingTransaction": (arg1) => {
        return window.go.backend.Handler.GetPendingTransaction(arg1);
      },
      /**
       * GetPendingTransactions
       * @returns {Promise<models.GetPendingTransactionsResponse|Error>}  - Go Type: *backend.GetPendingTransactionsResponse
       */
      "GetPendingTransactions": () => {
        return window.go.backend.Handler.GetPendingTransactions();
      },
      /**
       * GetServiceState
       * @returns {Promise<models.GetServiceStateResponse>}  - Go Type: backend.GetServiceStateResponse
       */
      "GetServiceState": () => {
        return window.go.backend.Handler.GetServiceState();
      },
      /**
       * GetTokenDAppState
       * @returns {Promise<models.GetServiceStateResponse>}  - Go Type: backend.GetServiceStateResponse
       */
      "GetTokenDAppState": () => {
        return window.go.backend.Handler.GetTokenDAppState();
      },
      /**
       * GetVersion
       * @returns {Promise<models.GetVersionResponse>}  - Go Type: *backend.GetVersionResponse
       */
      "GetVersion": () => {
        return window.go.backend.Handler.GetVersion();
      },
      /**
       * ImportNetwork
       * @param {models.ImportNetworkFromSourceRequest} arg1 - Go Type: *network.ImportNetworkFromSourceRequest
       * @returns {Promise<models.ImportNetworkFromSourceResponse|Error>}  - Go Type: *network.ImportNetworkFromSourceResponse
       */
      "ImportNetwork": (arg1) => {
        return window.go.backend.Handler.ImportNetwork(arg1);
      },
      /**
       * ImportWallet
       * @param {models.ImportWalletRequest} arg1 - Go Type: *wallet.ImportWalletRequest
       * @returns {Promise<models.ImportWalletResponse|Error>}  - Go Type: *wallet.ImportWalletResponse
       */
      "ImportWallet": (arg1) => {
        return window.go.backend.Handler.ImportWallet(arg1);
      },
      /**
       * InitialiseApp
       * @param {models.InitialiseAppRequest} arg1 - Go Type: *backend.InitialiseAppRequest
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
       * @param {models.IsolateKeyRequest} arg1 - Go Type: *wallet.IsolateKeyRequest
       * @returns {Promise<models.IsolateKeyResponse|Error>}  - Go Type: *wallet.IsolateKeyResponse
       */
      "IsolateKey": (arg1) => {
        return window.go.backend.Handler.IsolateKey(arg1);
      },
      /**
       * ListKeys
       * @param {models.ListKeysRequest} arg1 - Go Type: *wallet.ListKeysRequest
       * @returns {Promise<models.ListKeysResponse|Error>}  - Go Type: *wallet.ListKeysResponse
       */
      "ListKeys": (arg1) => {
        return window.go.backend.Handler.ListKeys(arg1);
      },
      /**
       * ListNetworks
       * @returns {Promise<models.ListNetworksResponse|Error>}  - Go Type: *network.ListNetworksResponse
       */
      "ListNetworks": () => {
        return window.go.backend.Handler.ListNetworks();
      },
      /**
       * ListWallets
       * @returns {Promise<models.ListWalletsResponse|Error>}  - Go Type: *wallet.ListWalletsResponse
       */
      "ListWallets": () => {
        return window.go.backend.Handler.ListWallets();
      },
      /**
       * ProcessSignRequest
       * @returns {Promise<void>} 
       */
      "ProcessSignRequest": () => {
        return window.go.backend.Handler.ProcessSignRequest();
      },
      /**
       * SaveNetworkConfig
       * @param {models.Network} arg1 - Go Type: *network.Network
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "SaveNetworkConfig": (arg1) => {
        return window.go.backend.Handler.SaveNetworkConfig(arg1);
      },
      /**
       * SearchForExistingConfiguration
       * @returns {Promise<models.SearchForExistingConfigurationResponse|Error>}  - Go Type: *backend.SearchForExistingConfigurationResponse
       */
      "SearchForExistingConfiguration": () => {
        return window.go.backend.Handler.SearchForExistingConfiguration();
      },
      /**
       * SignMessage
       * @param {models.SignMessageRequest} arg1 - Go Type: *wallet.SignMessageRequest
       * @returns {Promise<models.SignMessageResponse|Error>}  - Go Type: *wallet.SignMessageResponse
       */
      "SignMessage": (arg1) => {
        return window.go.backend.Handler.SignMessage(arg1);
      },
      /**
       * StartConsole
       * @param {models.StartServiceRequest} arg1 - Go Type: *backend.StartServiceRequest
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StartConsole": (arg1) => {
        return window.go.backend.Handler.StartConsole(arg1);
      },
      /**
       * StartService
       * @param {models.StartServiceRequest} arg1 - Go Type: *backend.StartServiceRequest
       * @returns {Promise<boolean|Error>}  - Go Type: bool
       */
      "StartService": (arg1) => {
        return window.go.backend.Handler.StartService(arg1);
      },
      /**
       * StartTokenDApp
       * @param {models.StartServiceRequest} arg1 - Go Type: *backend.StartServiceRequest
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
       * @param {models.TaintKeyRequest} arg1 - Go Type: *wallet.TaintKeyRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "TaintKey": (arg1) => {
        return window.go.backend.Handler.TaintKey(arg1);
      },
      /**
       * UntaintKey
       * @param {models.UntaintKeyRequest} arg1 - Go Type: *wallet.UntaintKeyRequest
       * @returns {Promise<Error>}  - Go Type: error
       */
      "UntaintKey": (arg1) => {
        return window.go.backend.Handler.UntaintKey(arg1);
      },
      /**
       * UpdateAppConfig
       * @param {models.Config} arg1 - Go Type: *config.Config
       * @returns {Promise<Error>}  - Go Type: error
       */
      "UpdateAppConfig": (arg1) => {
        return window.go.backend.Handler.UpdateAppConfig(arg1);
      },
    },
  },

};
export default go;
