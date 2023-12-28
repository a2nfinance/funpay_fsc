import { BatchPaymentState } from "src/controller/batch-payment/batchPaymentSlice";
import { MultipleRecurringPaymentState } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import {
    eCancelPaymentRequest,
    eCreateOneTimePayments,
    eCreateRecurringPayments,
    eDepositERC20Token,
    eDepositNativeToken,
    eGetRecipientPaymentRequests,
    eGetSenderPaymentRequests,
    eGetUserTokensBalance,
    eTransferPaymentRequest,
    eWithdrawFromBalance,
    eWithdrawFromPaymentRequest
} from "./evm/contract";
import { connectEVMChainOnWallet } from "./evm/wallet";


const DEFAULT_CHAIN = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;

const connectWallet = (chain: string) => {

    connectEVMChainOnWallet(DEFAULT_CHAIN);

}

const depositNativeToken = async (account: string, amount: number) => {
    eDepositNativeToken(account, amount);
}

const createdBatchRecurringPayments = async (account: string, recurringPaymentsData: MultipleRecurringPaymentState) => {

    await eCreateRecurringPayments(account, recurringPaymentsData);


}

const createOneTimePayments = async (account: string, oneTimePaymentsData: BatchPaymentState, isPayInvoice?: boolean) => {

    await eCreateOneTimePayments(account, oneTimePaymentsData, isPayInvoice)


}

const depositIRC2Token = async (tokenAddress: string, amount: number) => {

    await eDepositERC20Token(tokenAddress, amount);


}

const withdrawFromPaymentRequest = async (account: string, requestId: number, amount: number) => {

    await eWithdrawFromPaymentRequest(account, requestId, amount);


}

const cancelPaymentRequest = async (account: string, requestId: number) => {

    await eCancelPaymentRequest(account, requestId);


}

const transferPaymentRequest = async (account: string, requestId: number, to: string) => {

    await eTransferPaymentRequest(account, requestId, to);


}
const withdrawFromBalance = async (account: string, tokenAddress: string, amount: number) => {

    await eWithdrawFromBalance(account, tokenAddress, amount);


}


const getUserTokensBalance = async (account: string) => {
    let tokensBalance = await eGetUserTokensBalance(account);
    return tokensBalance;
}

const getSenderPaymentRequests = async (address: string) => {
    let result = [];

    result = await eGetSenderPaymentRequests(address);

    return result;
}

const getRecipientPaymentRequests = async (address: string) => {
    let result = [];


    result = await eGetRecipientPaymentRequests(address);


    return result;
}


export {
    cancelPaymentRequest, connectWallet, createOneTimePayments, createdBatchRecurringPayments, depositIRC2Token, depositNativeToken, getRecipientPaymentRequests, getSenderPaymentRequests, getUserTokensBalance, transferPaymentRequest,
    withdrawFromBalance, withdrawFromPaymentRequest
};
