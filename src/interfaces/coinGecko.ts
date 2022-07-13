export interface CoinGeckoVersion {
    major: string;
    minor: string;
    patch: string;
}

export interface CoinGeckoToken {
    address: string;
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}

export interface CoinGeckoTokenList {
    name: string;
    timestamp: string;
    version: CoinGeckoToken;
    keywords: string[];
    tokens: CoinGeckoToken[];
    logoURI: string;
}