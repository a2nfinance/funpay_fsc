import detectEthereumProvider from '@metamask/detect-provider';
import { chains } from 'src/config/chainSettings';
import { M_SET_DAPP_ACCOUNT } from 'src/controller/network/networkSlice';
import { store } from 'src/controller/store';
let currentAccount = null;
/**
 * Error messages:
 * 4001: The request was rejected by the user
 * -32602: The parameters were invalid
 * -32603: Internal error
 */

interface ConnectInfo {
    chainId: string;
}

interface ProviderMessage {
    type: string;
    data: unknown;
}

interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
}

interface SwitchEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
}

export const isInstalledMetamask = async () => {
    const provider = await detectEthereumProvider();
    if (!provider) {
        return false;
    }
}

export const swichChainId = async (chain: string) => {
    let chainInfo = chains[chain];
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainInfo.chainId }],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: chainInfo.chainId,
                            chainName: chainInfo.chainName,
                            rpcUrls: [chainInfo.rpcUrls],
                            blockExplorerUrls: [chainInfo.explorer],
                            nativeCurrency: {
                                name: "FON",
                                symbol: "FON",
                                decimals: 18
                            }
                        },
                    ],
                });
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainInfo.chainId }],
                });
            } catch (addError) {
                // handle "add" error
                console.log(addError);
            }
        } else {
            console.log(switchError);
        }
    }
}

export const connectEVMChainOnWallet = async (chain: string) => {
    await swichChainId(chain);
    window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
            handleAccountsChanged(accounts);
            addWalletListener();
        })
        .catch((err) => {
            if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                console.log('Please connect to MetaMask.');
            } else {
                console.error(err);
            }
        });

}

export const addWalletListener = () => {
    window.ethereum.on('accountsChanged', (accounts: Array<String>) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        handleAccountsChanged(accounts);
    });

    window.ethereum.on('chainChanged', (chainId: String) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
    });

    window.ethereum.on('connect', (connectInfo: ConnectInfo) => {
        console.log(connectInfo);
    })

    window.ethereum.on('disconnect', (error: ProviderRpcError) => {
        console.log(error);
    })

    window.ethereum.on('message', (message: ProviderMessage) => {
        console.log(message);
    })
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        store.dispatch(M_SET_DAPP_ACCOUNT(currentAccount));
    }
}