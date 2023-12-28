type Chains = {
    [key: string] : {
        chainName?: string,
        chainId: number | string,
        rpcUrls?: string,
        explorer: string,
        wallet?: string,
        contractAddress?: string 
    }
}

export const chains: Chains = {
    "fsc": {
        chainName: "FON smart chain",
        chainId: "0x3113E",
        rpcUrls: "https://fsc-dataseed2.fonscan.io",
        explorer: "https://fonscan.io",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        wallet: "metamask"
    }

}