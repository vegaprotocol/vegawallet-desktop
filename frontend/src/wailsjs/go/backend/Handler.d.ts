// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {backend} from '../models';
import {config} from '../models';
import {interactor} from '../models';
import {jsonrpc} from '../models';

export function CheckVersion():Promise<backend.CheckVersionResponse>;

export function ClearSentTransaction(arg1:backend.ClearSentTransactionRequest):Promise<Error>;

export function ConsentToTransaction(arg1:backend.ConsentToTransactionRequest):Promise<Error>;

export function GetAppConfig():Promise<config.Config>;

export function GetConsentRequest(arg1:backend.GetConsentRequestRequest):Promise<backend.ConsentRequest>;

export function GetServiceState():Promise<backend.GetServiceStateResponse>;

export function GetVersion():Promise<backend.GetVersionResponse>;

export function InitialiseApp(arg1:backend.InitialiseAppRequest):Promise<Error>;

export function IsAppInitialised():Promise<boolean>;

export function ListConsentRequests():Promise<backend.ListConsentRequestsResponse>;

export function ListSentTransactions():Promise<backend.ListSentTransactionsResponse>;

export function RespondToInteraction(arg1:interactor.Interaction):Promise<Error>;

export function SearchForExistingConfiguration():Promise<backend.SearchForExistingConfigurationResponse>;

export function StartService(arg1:backend.StartServiceRequest):Promise<boolean>;

export function StopService():Promise<boolean>;

export function SubmitWalletAPIRequest(arg1:jsonrpc.Request):Promise<jsonrpc.Response>;

export function UpdateAppConfig(arg1:config.Config):Promise<Error>;
