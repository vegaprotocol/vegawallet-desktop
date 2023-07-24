export namespace app {
	
	export class TelemetryConfig {
	    consentAsked: boolean;
	    enabled: boolean;
	
	    static createFrom(source: any = {}) {
	        return new TelemetryConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.consentAsked = source["consentAsked"];
	        this.enabled = source["enabled"];
	    }
	}
	export class Config {
	    logLevel: string;
	    vegaHome: string;
	    defaultNetwork: string;
	    telemetry: TelemetryConfig;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.logLevel = source["logLevel"];
	        this.vegaHome = source["vegaHome"];
	        this.defaultNetwork = source["defaultNetwork"];
	        this.telemetry = this.convertValues(source["telemetry"], TelemetryConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace backend {
	
	export class GetCurrentServiceInfo {
	    url: string;
	    logFilePath: string;
	    isRunning: boolean;
	    latestHealthState: string;
	
	    static createFrom(source: any = {}) {
	        return new GetCurrentServiceInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url = source["url"];
	        this.logFilePath = source["logFilePath"];
	        this.isRunning = source["isRunning"];
	        this.latestHealthState = source["latestHealthState"];
	    }
	}
	export class GetVersionResponse {
	    version: string;
	    gitHash: string;
	    backend?: version.GetSoftwareVersionResponse;
	    networksCompatibility?: version.CheckSoftwareCompatibilityResponse;
	
	    static createFrom(source: any = {}) {
	        return new GetVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.gitHash = source["gitHash"];
	        this.backend = this.convertValues(source["backend"], version.GetSoftwareVersionResponse);
	        this.networksCompatibility = this.convertValues(source["networksCompatibility"], version.CheckSoftwareCompatibilityResponse);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class InitialiseAppRequest {
	    vegaHome: string;
	
	    static createFrom(source: any = {}) {
	        return new InitialiseAppRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.vegaHome = source["vegaHome"];
	    }
	}
	export class LatestRelease {
	    version: string;
	    url: string;
	
	    static createFrom(source: any = {}) {
	        return new LatestRelease(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.url = source["url"];
	    }
	}
	export class SearchForExistingConfigurationResponse {
	    wallets: string[];
	    networks: string[];
	
	    static createFrom(source: any = {}) {
	        return new SearchForExistingConfigurationResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallets = source["wallets"];
	        this.networks = source["networks"];
	    }
	}
	export class StartServiceRequest {
	    network: string;
	    noVersionCheck: boolean;
	
	    static createFrom(source: any = {}) {
	        return new StartServiceRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.network = source["network"];
	        this.noVersionCheck = source["noVersionCheck"];
	    }
	}

}

export namespace connections {
	
	export class GenerateAPITokenWalletParams {
	    name: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new GenerateAPITokenWalletParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class GenerateAPITokenParams {
	    name: string;
	    expireIn?: number;
	    wallet: GenerateAPITokenWalletParams;
	
	    static createFrom(source: any = {}) {
	        return new GenerateAPITokenParams(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.expireIn = source["expireIn"];
	        this.wallet = this.convertValues(source["wallet"], GenerateAPITokenWalletParams);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class TokenSummary {
	    description: string;
	    token: string;
	    // Go type: time
	    creationDate: any;
	    // Go type: time
	    expirationDate?: any;
	
	    static createFrom(source: any = {}) {
	        return new TokenSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.description = source["description"];
	        this.token = source["token"];
	        this.creationDate = this.convertValues(source["creationDate"], null);
	        this.expirationDate = this.convertValues(source["expirationDate"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ListAPITokensResult {
	    tokens: TokenSummary[];
	
	    static createFrom(source: any = {}) {
	        return new ListAPITokensResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tokens = this.convertValues(source["tokens"], TokenSummary);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class WalletCredentials {
	    name: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new WalletCredentials(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class TokenDescription {
	    description: string;
	    // Go type: time
	    creationDate: any;
	    // Go type: time
	    expirationDate?: any;
	    token: string;
	    wallet: WalletCredentials;
	
	    static createFrom(source: any = {}) {
	        return new TokenDescription(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.description = source["description"];
	        this.creationDate = this.convertValues(source["creationDate"], null);
	        this.expirationDate = this.convertValues(source["expirationDate"], null);
	        this.token = source["token"];
	        this.wallet = this.convertValues(source["wallet"], WalletCredentials);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace interactor {
	
	export class Interaction {
	    traceID: string;
	    name: string;
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new Interaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.traceID = source["traceID"];
	        this.name = source["name"];
	        this.data = source["data"];
	    }
	}

}

export namespace jsonrpc {
	
	export class ErrorDetails {
	    code: number;
	    message: string;
	    data?: string;
	
	    static createFrom(source: any = {}) {
	        return new ErrorDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.message = source["message"];
	        this.data = source["data"];
	    }
	}
	export class Request {
	    jsonrpc: string;
	    method: string;
	    params?: any;
	    id?: string;
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.jsonrpc = source["jsonrpc"];
	        this.method = source["method"];
	        this.params = source["params"];
	        this.id = source["id"];
	    }
	}
	export class Response {
	    jsonrpc: string;
	    result?: any;
	    error?: ErrorDetails;
	    id?: string;
	
	    static createFrom(source: any = {}) {
	        return new Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.jsonrpc = source["jsonrpc"];
	        this.result = source["result"];
	        this.error = this.convertValues(source["error"], ErrorDetails);
	        this.id = source["id"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace service {
	
	export class APIV1Config {
	    // Go type: encoding
	    maximumTokenDuration: any;
	
	    static createFrom(source: any = {}) {
	        return new APIV1Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.maximumTokenDuration = this.convertValues(source["maximumTokenDuration"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Nodes {
	    maximumRetryPerRequest: number;
	    // Go type: encoding
	    maximumRequestDuration: any;
	
	    static createFrom(source: any = {}) {
	        return new Nodes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.maximumRetryPerRequest = source["maximumRetryPerRequest"];
	        this.maximumRequestDuration = this.convertValues(source["maximumRequestDuration"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class APIV2Config {
	    nodes: Nodes;
	
	    static createFrom(source: any = {}) {
	        return new APIV2Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.nodes = this.convertValues(source["nodes"], Nodes);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ServerConfig {
	    port: number;
	    host: string;
	
	    static createFrom(source: any = {}) {
	        return new ServerConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.port = source["port"];
	        this.host = source["host"];
	    }
	}
	export class Config {
	    // Go type: encoding
	    logLevel: any;
	    server: ServerConfig;
	    apiV1: APIV1Config;
	    apiV2: APIV2Config;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.logLevel = this.convertValues(source["logLevel"], null);
	        this.server = this.convertValues(source["server"], ServerConfig);
	        this.apiV1 = this.convertValues(source["apiV1"], APIV1Config);
	        this.apiV2 = this.convertValues(source["apiV2"], APIV2Config);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace version {
	
	export class NetworkCompatibility {
	    network: string;
	    isCompatible: boolean;
	    retrievedVersion: string;
	    error: any;
	
	    static createFrom(source: any = {}) {
	        return new NetworkCompatibility(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.network = source["network"];
	        this.isCompatible = source["isCompatible"];
	        this.retrievedVersion = source["retrievedVersion"];
	        this.error = source["error"];
	    }
	}
	export class CheckSoftwareCompatibilityResponse {
	    networksCompatibility: NetworkCompatibility[];
	
	    static createFrom(source: any = {}) {
	        return new CheckSoftwareCompatibilityResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.networksCompatibility = this.convertValues(source["networksCompatibility"], NetworkCompatibility);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetSoftwareVersionResponse {
	    version: string;
	    gitHash: string;
	
	    static createFrom(source: any = {}) {
	        return new GetSoftwareVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.gitHash = source["gitHash"];
	    }
	}

}

