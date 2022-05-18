import * as models from './models';

export interface go {
  "backend": {
    "Handler": {
		AnnotateKey(arg1:models.AnnotateKeyRequest):Promise<Error>
		CheckVersion():Promise<models.CheckVersionResponse|Error>
		ClearSentTransaction(arg1:models.ClearSentTransactionRequest):Promise<Error>
		ConsentToTransaction(arg1:models.ConsentToTransactionRequest):Promise<Error>
		CreateWallet(arg1:models.CreateWalletRequest):Promise<models.CreateWalletResponse|Error>
		DeleteWallet(arg1:models.DeleteWalletRequest):Promise<Error>
		DescribeKey(arg1:models.DescribeKeyRequest):Promise<models.DescribeKeyResponse|Error>
		GenerateKey(arg1:models.GenerateKeyRequest):Promise<models.GenerateKeyResponse|Error>
		GetAppConfig():Promise<models.Config|Error>
		GetConsentRequest(arg1:models.GetConsentRequestRequest):Promise<models.ConsentRequest|Error>
		GetConsoleState():Promise<models.GetServiceStateResponse>
		GetNetworkConfig(arg1:string):Promise<models.Network|Error>
		GetServiceState():Promise<models.GetServiceStateResponse>
		GetTokenDAppState():Promise<models.GetServiceStateResponse>
		GetVersion():Promise<models.GetVersionResponse>
		ImportNetwork(arg1:models.ImportNetworkFromSourceRequest):Promise<models.ImportNetworkFromSourceResponse|Error>
		ImportWallet(arg1:models.ImportWalletRequest):Promise<models.ImportWalletResponse|Error>
		InitialiseApp(arg1:models.InitialiseAppRequest):Promise<Error>
		IsAppInitialised():Promise<boolean|Error>
		IsolateKey(arg1:models.IsolateKeyRequest):Promise<models.IsolateKeyResponse|Error>
		ListConsentRequests():Promise<models.ListConsentRequestsResponse|Error>
		ListKeys(arg1:models.ListKeysRequest):Promise<models.ListKeysResponse|Error>
		ListNetworks():Promise<models.ListNetworksResponse|Error>
		ListSentTransactions():Promise<models.ListSentTransactionsResponse|Error>
		ListWallets():Promise<models.ListWalletsResponse|Error>
		SaveNetworkConfig(arg1:models.Network):Promise<boolean|Error>
		SearchForExistingConfiguration():Promise<models.SearchForExistingConfigurationResponse|Error>
		SignMessage(arg1:models.SignMessageRequest):Promise<models.SignMessageResponse|Error>
		StartConsole(arg1:models.StartServiceRequest):Promise<boolean|Error>
		StartService(arg1:models.StartServiceRequest):Promise<boolean|Error>
		StartTokenDApp(arg1:models.StartServiceRequest):Promise<boolean|Error>
		StopConsole():Promise<boolean|Error>
		StopService():Promise<boolean|Error>
		StopTokenDApp():Promise<boolean|Error>
		TaintKey(arg1:models.TaintKeyRequest):Promise<Error>
		UntaintKey(arg1:models.UntaintKeyRequest):Promise<Error>
		UpdateAppConfig(arg1:models.Config):Promise<Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
