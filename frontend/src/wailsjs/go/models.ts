export namespace config {
	
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

export namespace network {
	
	export class GraphQLConfig {
	    hosts: string[];
	
	    static createFrom(source: any = {}) {
	        return new GraphQLConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hosts = source["hosts"];
	    }
	}
	export class ImportNetworkFromSourceRequest {
	    filePath: string;
	    url: string;
	    name: string;
	    force: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ImportNetworkFromSourceRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.filePath = source["filePath"];
	        this.url = source["url"];
	        this.name = source["name"];
	        this.force = source["force"];
	    }
	}
	export class ImportNetworkFromSourceResponse {
	    name: string;
	    filePath: string;
	
	    static createFrom(source: any = {}) {
	        return new ImportNetworkFromSourceResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.filePath = source["filePath"];
	    }
	}
	export class ListNetworksResponse {
	    networks: string[];
	
	    static createFrom(source: any = {}) {
	        return new ListNetworksResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.networks = source["networks"];
	    }
	}
	export class RESTConfig {
	    hosts: string[];
	
	    static createFrom(source: any = {}) {
	        return new RESTConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hosts = source["hosts"];
	    }
	}
	export class GRPCConfig {
	    hosts: string[];
	    retries: number;
	
	    static createFrom(source: any = {}) {
	        return new GRPCConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hosts = source["hosts"];
	        this.retries = source["retries"];
	    }
	}
	export class APIConfig {
	    grpc: GRPCConfig;
	    rest: RESTConfig;
	    graphQl: GraphQLConfig;
	
	    static createFrom(source: any = {}) {
	        return new APIConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.grpc = this.convertValues(source["grpc"], GRPCConfig);
	        this.rest = this.convertValues(source["rest"], RESTConfig);
	        this.graphQl = this.convertValues(source["graphQl"], GraphQLConfig);
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
	export class Network {
	    name: string;
	    // Go type: encoding.LogLevel
	    level: any;
	    // Go type: encoding.Duration
	    tokenExpiry: any;
	    port: number;
	    host: string;
	    api: APIConfig;
	
	    static createFrom(source: any = {}) {
	        return new Network(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.level = this.convertValues(source["level"], null);
	        this.tokenExpiry = this.convertValues(source["tokenExpiry"], null);
	        this.port = source["port"];
	        this.host = source["host"];
	        this.api = this.convertValues(source["api"], APIConfig);
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

export namespace wallet {
	
	export class CreatedWallet {
	    name: string;
	    version: number;
	    filePath: string;
	    recoveryPhrase: string;
	
	    static createFrom(source: any = {}) {
	        return new CreatedWallet(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.version = source["version"];
	        this.filePath = source["filePath"];
	        this.recoveryPhrase = source["recoveryPhrase"];
	    }
	}
	export class Algorithm {
	    name: string;
	    version: number;
	
	    static createFrom(source: any = {}) {
	        return new Algorithm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.version = source["version"];
	    }
	}
	export class SignMessageResponse {
	    hexSignature: string;
	    bytesSignature: number[];
	
	    static createFrom(source: any = {}) {
	        return new SignMessageResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hexSignature = source["hexSignature"];
	        this.bytesSignature = source["bytesSignature"];
	    }
	}
	export class UntaintKeyRequest {
	    wallet: string;
	    pubKey: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new UntaintKeyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.pubKey = source["pubKey"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class DescribeKeyRequest {
	    wallet: string;
	    passphrase: string;
	    pubKey: string;
	
	    static createFrom(source: any = {}) {
	        return new DescribeKeyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.passphrase = source["passphrase"];
	        this.pubKey = source["pubKey"];
	    }
	}
	export class Meta {
	    key: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new Meta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.value = source["value"];
	    }
	}
	export class DescribeKeyResponse {
	    publicKey: string;
	    algorithm: Algorithm;
	    meta: Meta[];
	    isTainted: boolean;
	
	    static createFrom(source: any = {}) {
	        return new DescribeKeyResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.publicKey = source["publicKey"];
	        this.algorithm = this.convertValues(source["algorithm"], Algorithm);
	        this.meta = this.convertValues(source["meta"], Meta);
	        this.isTainted = source["isTainted"];
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
	export class IsolateKeyResponse {
	    wallet: string;
	    filePath: string;
	
	    static createFrom(source: any = {}) {
	        return new IsolateKeyResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.filePath = source["filePath"];
	    }
	}
	export class ListKeysRequest {
	    wallet: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new ListKeysRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class CreateWalletRequest {
	    wallet: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateWalletRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class GenerateKeyRequest {
	    wallet: string;
	    metadata: Meta[];
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new GenerateKeyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.metadata = this.convertValues(source["metadata"], Meta);
	        this.passphrase = source["passphrase"];
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
	export class GenerateKeyResponse {
	    publicKey: string;
	    algorithm: Algorithm;
	    meta: Meta[];
	
	    static createFrom(source: any = {}) {
	        return new GenerateKeyResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.publicKey = source["publicKey"];
	        this.algorithm = this.convertValues(source["algorithm"], Algorithm);
	        this.meta = this.convertValues(source["meta"], Meta);
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
	export class IsolateKeyRequest {
	    wallet: string;
	    pubKey: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new IsolateKeyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.pubKey = source["pubKey"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class ListWalletsResponse {
	    wallets: string[];
	
	    static createFrom(source: any = {}) {
	        return new ListWalletsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallets = source["wallets"];
	    }
	}
	export class TaintKeyRequest {
	    wallet: string;
	    pubKey: string;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new TaintKeyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.pubKey = source["pubKey"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class SignMessageRequest {
	    wallet: string;
	    pubKey: string;
	    message: number[];
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new SignMessageRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.pubKey = source["pubKey"];
	        this.message = source["message"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class AnnotateKeyRequest {
	    wallet: string;
	    pubKey: string;
	    metadata: Meta[];
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new AnnotateKeyRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.pubKey = source["pubKey"];
	        this.metadata = this.convertValues(source["metadata"], Meta);
	        this.passphrase = source["passphrase"];
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
	export class FirstPublicKey {
	    publicKey: string;
	    algorithm: Algorithm;
	    meta: Meta[];
	
	    static createFrom(source: any = {}) {
	        return new FirstPublicKey(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.publicKey = source["publicKey"];
	        this.algorithm = this.convertValues(source["algorithm"], Algorithm);
	        this.meta = this.convertValues(source["meta"], Meta);
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
	export class CreateWalletResponse {
	    wallet: CreatedWallet;
	    key: FirstPublicKey;
	
	    static createFrom(source: any = {}) {
	        return new CreateWalletResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = this.convertValues(source["wallet"], CreatedWallet);
	        this.key = this.convertValues(source["key"], FirstPublicKey);
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
	
	export class ImportWalletRequest {
	    wallet: string;
	    recoveryPhrase: string;
	    version: number;
	    passphrase: string;
	
	    static createFrom(source: any = {}) {
	        return new ImportWalletRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
	        this.recoveryPhrase = source["recoveryPhrase"];
	        this.version = source["version"];
	        this.passphrase = source["passphrase"];
	    }
	}
	export class ImportedWallet {
	    name: string;
	    version: number;
	    filePath: string;
	
	    static createFrom(source: any = {}) {
	        return new ImportedWallet(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.version = source["version"];
	        this.filePath = source["filePath"];
	    }
	}
	export class ImportWalletResponse {
	    wallet: ImportedWallet;
	    key: FirstPublicKey;
	
	    static createFrom(source: any = {}) {
	        return new ImportWalletResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = this.convertValues(source["wallet"], ImportedWallet);
	        this.key = this.convertValues(source["key"], FirstPublicKey);
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
	
	export class NamedPubKey {
	    name: string;
	    publicKey: string;
	
	    static createFrom(source: any = {}) {
	        return new NamedPubKey(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.publicKey = source["publicKey"];
	    }
	}
	export class ListKeysResponse {
	    keys: NamedPubKey[];
	
	    static createFrom(source: any = {}) {
	        return new ListKeysResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.keys = this.convertValues(source["keys"], NamedPubKey);
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
	export class CheckVersionResponse {
	    version: string;
	    releaseUrl: string;
	
	    static createFrom(source: any = {}) {
	        return new CheckVersionResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.releaseUrl = source["releaseUrl"];
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
	export class DeleteWalletRequest {
	    wallet: string;
	
	    static createFrom(source: any = {}) {
	        return new DeleteWalletRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.wallet = source["wallet"];
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
	export class ConsentToTransactionRequest {
	    txId: string;
	    decision: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ConsentToTransactionRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.txId = source["txId"];
	        this.decision = source["decision"];
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

}

