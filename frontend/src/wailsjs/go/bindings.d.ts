export interface go {
  "backend": {
    "Handler": {
		AnnotateKey(arg1:AnnotateKeyRequest):Promise<Error>
		CheckVersion():Promise<CheckVersionResponse|Error>
		CreateWallet(arg1:CreateWalletRequest):Promise<CreateWalletResponse|Error>
		DescribeKey(arg1:DescribeKeyRequest):Promise<DescribeKeyResponse|Error>
		GenerateKey(arg1:GenerateKeyRequest):Promise<GenerateKeyResponse|Error>
		GetConsoleState():Promise<GetServiceStateResponse>
		GetNetworkConfig(arg1:string):Promise<Network|Error>
		GetServiceState():Promise<GetServiceStateResponse>
		GetTokenDAppState():Promise<GetServiceStateResponse>
		GetVersion():Promise<GetVersionResponse>
		ImportNetwork(arg1:ImportNetworkFromSourceRequest):Promise<ImportNetworkFromSourceResponse|Error>
		ImportWallet(arg1:ImportWalletRequest):Promise<ImportWalletResponse|Error>
		InitialiseApp(arg1:Config):Promise<Error>
		IsAppInitialised():Promise<boolean|Error>
		IsolateKey(arg1:IsolateKeyRequest):Promise<IsolateKeyResponse|Error>
		ListKeys(arg1:ListKeysRequest):Promise<ListKeysResponse|Error>
		ListNetworks():Promise<ListNetworksResponse|Error>
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
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
