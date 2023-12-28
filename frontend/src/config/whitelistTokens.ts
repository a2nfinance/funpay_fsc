const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export type Token = {
    name: string,
    symbol: string,
    address?: string,
    decimals: number,
    logo: string,
    isNative: boolean
}
type WhiteListTokenOfChain = {
    [key: string]: Token[]
}

const NATIVE_ADDRESS = contractAddress;

export const whiteListTokenOfChain: WhiteListTokenOfChain = {
    "fsc": [
        {
            name: "FON",
            symbol: "FON",
            address: NATIVE_ADDRESS,
            decimals: 18,
            logo: "/tokens/fon.png",
            isNative: true
        },
        {
            name: "USDT",
            symbol: "USDT",
            address: "0x9a9eD7440a3850c4D7240c9FcA8B7C96802615f0",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        },
        {
            name: "Wrapped FON",
            symbol: "WFON",
            address: "0xb582fD9d0D5C3515EEB6b02fF2d6eE0b6E45E7A7",
            decimals: 18,
            logo: "/tokens/fon.png",
            isNative: false
        }
    ]
}

export const tokenAddressInfo = {
    "fsc": {
        "0x0F718444De2eD7c35FFdEDEb476CE1c62b6d0096": {
            name: "FON",
            symbol: "FON",
            address: NATIVE_ADDRESS,
            decimals: 18,
            logo: "/tokens/fon.png",
            isNative: true
        },
        "cxa6b9e978a309e19339c349b2ee5d75ae9ea55ddb": {
            name: "USDT",
            symbol: "USDT",
            address: "0x9a9eD7440a3850c4D7240c9FcA8B7C96802615f0",
            decimals: 18,
            logo: "/tokens/usdt.png",
            isNative: false
        },
        "0xb582fD9d0D5C3515EEB6b02fF2d6eE0b6E45E7A7": {
            name: "Wrapped FON",
            symbol: "WFON",
            address: "0xb582fD9d0D5C3515EEB6b02fF2d6eE0b6E45E7A7",
            decimals: 18,
            logo: "/tokens/fon.png",
            isNative: false
        },
    }
}