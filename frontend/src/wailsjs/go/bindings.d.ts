export interface go {
  "backend": {
    "Handler": {
		AnnotateKey(arg1:AnnotateKeyRequest):Promise<Error>
		CheckVersion():Promise<CheckVersionResponse|Error>
		ClearSentTransaction(arg1:ClearSentTransactionRequest):Promise<Error>
		ConsentToTransaction(arg1:ConsentToTransactionRequest):Promise<Error>
		CreateWallet(arg1:CreateWalletRequest):Promise<CreateWalletResponse|Error>
		DeleteWallet(arg1:DeleteWalletRequest):Promise<Error>
		DescribeKey(arg1:DescribeKeyRequest):Promise<DescribeKeyResponse|Error>
		GenerateKey(arg1:GenerateKeyRequest):Promise<GenerateKeyResponse|Error>
		GetAppConfig():Promise<Config|Error>
		GetConsentRequest(arg1:GetConsentRequestRequest):Promise<ConsentRequest|Error>
		GetConsoleState():Promise<GetServiceStateResponse>
		GetNetworkConfig(arg1:string):Promise<Network|Error>
		GetServiceState():Promise<GetServiceStateResponse>
		GetTokenDAppState():Promise<GetServiceStateResponse>
		GetVersion():Promise<GetVersionResponse>
		ImportNetwork(arg1:ImportNetworkFromSourceRequest):Promise<ImportNetworkFromSourceResponse|Error>
		ImportWallet(arg1:ImportWalletRequest):Promise<ImportWalletResponse|Error>
		InitialiseApp(arg1:InitialiseAppRequest):Promise<Error>
		IsAppInitialised():Promise<boolean|Error>
		IsolateKey(arg1:IsolateKeyRequest):Promise<IsolateKeyResponse|Error>
		ListConsentRequests():Promise<ListConsentRequestsResponse|Error>
		ListKeys(arg1:ListKeysRequest):Promise<ListKeysResponse|Error>
		ListNetworks():Promise<ListNetworksResponse|Error>
		ListSentTransactions():Promise<ListSentTransactionsResponse|Error>
		ListWallets():Promise<ListWalletsResponse|Error>
		SaveNetworkConfig(arg1:Network):Promise<boolean|Error>
		SearchForExistingConfiguration():Promise<SearchForExistingConfigurationResponse|Error>
		SignMessage(arg1:SignMessageRequest):Promise<SignMessageResponse|Error>
		StartConsole(arg1:StartServiceRequest):Promise<boolean|Error>
		StartService(arg1:StartServiceRequest):Promise<boolean|Error>
		StartTokenDApp(arg1:StartServiceRequest):Promise<boolean|Error>
		StopConsole():Promise<boolean|Error>
		StopService():Promise<boolean|Error>
		StopTokenDApp():Promise<boolean|Error>
		TaintKey(arg1:TaintKeyRequest):Promise<Error>
		UntaintKey(arg1:UntaintKeyRequest):Promise<Error>
		UpdateAppConfig(arg1:Config):Promise<Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
