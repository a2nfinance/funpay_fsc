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
        chainId: "0x" +(3141).toString(16),
        rpcUrls: "https://api.hyperspace.node.glif.io/rpc/v1",
        explorer: "https://hyperspace.filfox.info/en/",
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        wallet: "metamask"
    }

}