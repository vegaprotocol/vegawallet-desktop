export namespace backend {
	
<<<<<<< HEAD
<<<<<<< HEAD
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	        this.decision = source["decision"];
	    }
	}
<<<<<<< HEAD
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

export namespace backend {
	
<<<<<<< HEAD
<<<<<<< HEAD
	export class StartServiceRequest {
	    network: string;
=======
	export class GetConsentRequestRequest {
	    txId: string;
>>>>>>> bbe9a0e (fix: variable name in generated client)
=======
	export class TelemetryConfig {
	    consentAsked: boolean;
	    enabled: boolean;
>>>>>>> d74b46e (feat: add generator and fix types)
=======
	export class ConsentToTransactionRequest {
	    txId: string;
	    decision: boolean;
>>>>>>> 4560cc7 (fix: network imports)
	
	    static createFrom(source: any = {}) {
	        return new ConsentToTransactionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	        this.decision = source["decision"];
	    }
	}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	export class CheckVersionResponse {
=======
	export class GetVersionResponse {
>>>>>>> 82af6ee (fix: networks)
	    version: string;
	    gitHash: string;
=======
	export class StartServiceRequest {
	    network: string;
>>>>>>> 02badee (feat: add postinstall script to regenerate the jsonrpc client)
	
	    static createFrom(source: any = {}) {
	        return new StartServiceRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
<<<<<<< HEAD
	        this.version = source["version"];
<<<<<<< HEAD
	        this.releaseUrl = source["releaseUrl"];
	    }
	}
	export class ConsentToTransactionRequest {
	    txId: string;
	    decision: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ConsentToTransactionRequest(source);
=======
	export class GetConsentRequestRequest {
	    txId: string;
	
	    static createFrom(source: any = {}) {
	        return new GetConsentRequestRequest(source);
>>>>>>> 4560cc7 (fix: network imports)
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
<<<<<<< HEAD
	        this.decision = source["decision"];
	    }
	}
	export class GetVersionResponse {
	    version: string;
	    gitHash: string;
	
	    static createFrom(source: any = {}) {
	        return new GetVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
=======
>>>>>>> 82af6ee (fix: networks)
	        this.gitHash = source["gitHash"];
=======
	        this.network = source["network"];
>>>>>>> 02badee (feat: add postinstall script to regenerate the jsonrpc client)
	    }
	}
	export class GetConsentRequestRequest {
	    txId: string;
=======
	export class InitialiseAppRequest {
	    vegaHome: string;
>>>>>>> bbe9a0e (fix: variable name in generated client)
=======
	export class Config {
	    logLevel: string;
	    vegaHome: string;
	    defaultNetwork: string;
	    telemetry: TelemetryConfig;
>>>>>>> d74b46e (feat: add generator and fix types)
=======
	    }
	}
	export class InitialiseAppRequest {
	    vegaHome: string;
>>>>>>> 4560cc7 (fix: network imports)
	
	    static createFrom(source: any = {}) {
	        return new InitialiseAppRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.vegaHome = source["vegaHome"];
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
	export class ClearSentTransactionRequest {
	    txId: string;
	
	    static createFrom(source: any = {}) {
	        return new ClearSentTransactionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	    }
	}
	export class ConsentRequest {
	    txId: string;
	    tx: string;
	    // Go type: time.Time
	    receivedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new ConsentRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	        this.tx = source["tx"];
	        this.receivedAt = this.convertValues(source["receivedAt"], null);
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
	export class GetServiceStateResponse {
	    url: string;
	    running: boolean;
	
	    static createFrom(source: any = {}) {
	        return new GetServiceStateResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url = source["url"];
	        this.running = source["running"];
	    }
	}
	export class GetVersionResponse {
	    version: string;
	    gitHash: string;
	
	    static createFrom(source: any = {}) {
	        return new GetVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.gitHash = source["gitHash"];
	    }
	}
	export class ListConsentRequestsResponse {
	    requests: ConsentRequest[];
	
	    static createFrom(source: any = {}) {
	        return new ListConsentRequestsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.requests = this.convertValues(source["requests"], ConsentRequest);
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
	export class ClearSentTransactionRequest {
	    txId: string;
	
	    static createFrom(source: any = {}) {
	        return new ClearSentTransactionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	    }
	}
	export class GetConsentRequestRequest {
	    txId: string;
	
	    static createFrom(source: any = {}) {
	        return new GetConsentRequestRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	    }
	}
	
	export class GetServiceStateResponse {
	    url: string;
	    running: boolean;
	
	    static createFrom(source: any = {}) {
	        return new GetServiceStateResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.url = source["url"];
	        this.running = source["running"];
	    }
	}
=======
>>>>>>> 82af6ee (fix: networks)
=======

}

export namespace backend {
	
>>>>>>> d74b46e (feat: add generator and fix types)
=======
>>>>>>> 4560cc7 (fix: network imports)
	export class SentTransaction {
	    txId: string;
	    txHash: string;
	    tx: string;
	    // Go type: time.Time
	    sentAt: any;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new SentTransaction(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	        this.txHash = source["txHash"];
	        this.tx = source["tx"];
	        this.sentAt = this.convertValues(source["sentAt"], null);
	        this.error = source["error"];
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
	export class ListSentTransactionsResponse {
	    transactions: SentTransaction[];
	
	    static createFrom(source: any = {}) {
	        return new ListSentTransactionsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.transactions = this.convertValues(source["transactions"], SentTransaction);
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

}

export namespace config {
=======
=======
>>>>>>> d74b46e (feat: add generator and fix types)
	export class SearchForExistingConfigurationResponse {
	    wallets: string[];
	    networks: string[];
=======
	export class CheckVersionResponse {
	    version: string;
	    releaseUrl: string;
>>>>>>> 4560cc7 (fix: network imports)
	
	    static createFrom(source: any = {}) {
	        return new CheckVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.releaseUrl = source["releaseUrl"];
	    }
	}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bbe9a0e (fix: variable name in generated client)
=======
>>>>>>> d74b46e (feat: add generator and fix types)
	export class CheckVersionResponse {
	    version: string;
	    releaseUrl: string;
=======

}

export namespace config {
	
	export class TelemetryConfig {
	    consentAsked: boolean;
	    enabled: boolean;
>>>>>>> 4560cc7 (fix: network imports)
	
	    static createFrom(source: any = {}) {
	        return new TelemetryConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.consentAsked = source["consentAsked"];
	        this.enabled = source["enabled"];
	    }
	}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	export class CheckVersionResponse {
	    version: string;
	    releaseUrl: string;
>>>>>>> 82af6ee (fix: networks)
=======
	export class ClearSentTransactionRequest {
	    txId: string;
>>>>>>> 02badee (feat: add postinstall script to regenerate the jsonrpc client)
=======
	export class ConsentRequest {
	    txId: string;
	    tx: string;
	    // Go type: time.Time
	    receivedAt: any;
>>>>>>> d74b46e (feat: add generator and fix types)
=======
	export class Config {
	    logLevel: string;
	    vegaHome: string;
	    defaultNetwork: string;
	    telemetry: TelemetryConfig;
>>>>>>> 4560cc7 (fix: network imports)
	
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

export namespace jsonrpc {
	
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

