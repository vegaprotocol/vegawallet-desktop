/* Do not change, this code is generated from Golang structs */

export {};

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
export class Network {


    static createFrom(source: any = {}) {
        return new Network(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);

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
export class Config {
    vegaHome: string;

    static createFrom(source: any = {}) {
        return new Config(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.vegaHome = source["vegaHome"];
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

export class StartServiceRequest {
    network: string;
    withConsole: boolean;
    withTokenDApp: boolean;

    static createFrom(source: any = {}) {
        return new StartServiceRequest(source);
    }

    constructor(source: any = {}) {
        if ('string' === typeof source) source = JSON.parse(source);
        this.network = source["network"];
        this.withConsole = source["withConsole"];
        this.withTokenDApp = source["withTokenDApp"];
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