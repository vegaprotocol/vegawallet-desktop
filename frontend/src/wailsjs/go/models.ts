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
	    backend?: version.GetVersionResponse;
	
	    static createFrom(source: any = {}) {
	        return new GetVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.gitHash = source["gitHash"];
	        this.backend = this.convertValues(source["backend"], version.GetVersionResponse);
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
	
	    static createFrom(source: any = {}) {
	        return new StartServiceRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.network = source["network"];
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
	export class GetVersionResponse {
	    version: string;
	    gitHash: string;
	    networksCompatibility: NetworkCompatibility[];
	
	    static createFrom(source: any = {}) {
	        return new GetVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.gitHash = source["gitHash"];
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

}

