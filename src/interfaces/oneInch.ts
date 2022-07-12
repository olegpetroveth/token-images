export interface OneInchVersion {
    major: string;
    minor: string;
    patch: string;
}

export interface OneInchToken {
    address: string;
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}

export interface OneInchTokenList {
    name: string;
    timestamp: string;
    version: OneInchVersion;
    keywords: string[];
    tokens: OneInchToken[];
    logoURI: string;
}