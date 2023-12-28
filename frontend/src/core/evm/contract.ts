import { ethers } from "ethers";
import ABI from "src/abis/funpay.json";
import { chains } from "src/config/chainSettings";
import { errorToastContent, successToastContent } from "src/config/toastContent";
import { tokenAddressInfo } from "src/config/whitelistTokens";
import { BatchPaymentState } from "src/controller/batch-payment/batchPaymentSlice";
import { MultipleRecurringPaymentState } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import { getReceivedInvoicesThunk } from "src/controller/invoice/getReceivedInvoicesThunk";
import { setShowPayModal } from "src/controller/invoice/invoiceSlice";
import { updateInvoiceStatusThunk } from "src/controller/invoice/updateInvoiceStatusThunk";
import { getReceivedPaymentRequestsThunk } from "src/controller/payment-list/getReceivedPaymentRequestThunk";
import { getSenderPaymentRequestsThunk } from "src/controller/payment-list/getUserPaymentRequestThunk";
import { PaymentRequest, setShowCancelModal, setShowTransferModal, setShowWithdrawModal } from "src/controller/payment-list/paymentListSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import { store } from "src/controller/store";
import { connectEVMChainOnWallet } from "./wallet";
const DEFAULT_CHAIN = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;
const chain = chains[DEFAULT_CHAIN];

const checkAndRequireConnect = async () => {
    if (!(window.ethereum && window.ethereum.isConnected)) {
        await connectEVMChainOnWallet(DEFAULT_CHAIN);
    }
}

const getReadContract = () => {
    let contractAddress = chain.contractAddress;
    let provider = ethers.providers.getDefaultProvider(chain.rpcUrls, chain.chainId);
    let contract = new ethers.Contract(
        contractAddress,
        ABI,
        provider);
    return contract;
}

const getWriteContract = () => {
    let contractAddress = chain.contractAddress;
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    let contract = new ethers.Contract(
        contractAddress,
        ABI,
        signer);
    return contract;
}

export const eDepositNativeToken = async (account: string, amount: number) => {
    try {
        await checkAndRequireConnect();

        let contract = getWriteContract();
        const deposit = await contract.deposit(
            chain.contractAddress,
            ethers.utils.parseUnits(amount.toString(), "18"),
            {
                value: ethers.utils.parseUnits(amount.toString(), "18")
            }
        )

        let result = await deposit.wait();
        let depositEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', depositEvent.transactionHash);
        console.log('- Amount:', amount);
        console.groupEnd();
        successToastContent(
            `Deposit success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.deposit,
        att: processKeys.processing,
        value: false
    }))


}

export const eDepositERC20Token = async (tokenAddress: string, amount: number) => {
    try {

        await checkAndRequireConnect();

        let contract = getWriteContract();
        const depositERC20 = await contract.deposit(
            tokenAddress,
            ethers.utils.formatUnits(amount, "18")
        )

        let result = await depositERC20.wait();
        let depositEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', depositEvent.transactionHash);
        console.log('- Amount:', amount);
        console.groupEnd();
        successToastContent(
            `Deposit success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.deposit,
        att: processKeys.processing,
        value: false
    }))
}


export const eCreateRecurringPayments = async (account: string, recurringPaymentsData: MultipleRecurringPaymentState) => {
    try {
        let setting = recurringPaymentsData.generalSetting;
        let recipients = recurringPaymentsData.recipients;
        // Convert miliseconds to seconds, to match block.timestamp in unix timestamp.
        let settingData = [
            setting.tokenAddress,
            setting.isNativeToken,
            Math.floor(setting.startDate/1000),
            setting.whoCanCancel,
            setting.whoCanTransfer
        ]

        let recipientsData = [];

        for (let i = 0; i < recipients.length; i++) {
            let recipient = recipients[i];
            recipientsData.push([
                recipient.recipient,
                recipient.unlockEvery * recipient.unlockEveryType,
                ethers.utils.parseUnits(recipient.unlockAmountPerTime.toString(), 18),
                recipient.numberOfUnlocks,
                recipient.prepaidPercentage
            ])
        }



        await checkAndRequireConnect();

        let contract = getWriteContract();
        const createPaymentRequest = await contract.createRecurringPayments(
            settingData,
            recipientsData
        )

        let result = await createPaymentRequest.wait();
        let createPaymentEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', createPaymentEvent.transactionHash);
        console.log('- Account:', account);
        console.groupEnd();
        successToastContent(
            `Create recurring payments success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.createBatchPayments,
        att: processKeys.processing,
        value: false
    }))
}

export const eCreateOneTimePayments = async (account: string, oneTimePaymentsData: BatchPaymentState, isPayInvoice?: boolean) => {
    try {
        let setting = oneTimePaymentsData.generalSetting;
        let recipients = oneTimePaymentsData.recipients;
        let settingData = [
            setting.tokenAddress,
            setting.isNativeToken,
            Math.floor(setting.startDate/1000),
            setting.isPayNow
        ]
        let recipientsData = [];

        for (let i = 0; i < recipients.length; i++) {
            let recipient = recipients[i];
            recipientsData.push([
                recipient.recipient,
                ethers.utils.parseUnits(recipient.amount.toString(), 18),
            ])
        }

        console.log(settingData, recipientsData);

        await checkAndRequireConnect();
        console.log(settingData, recipientsData);
        let contract = getWriteContract();
        const createPaymentRequest = await contract.createOneTimePayment(
            settingData,
            recipientsData
        )

        let result = await createPaymentRequest.wait();
        let createPaymentEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', createPaymentEvent.transactionHash);
        console.log('- Account:', account);
        console.groupEnd();
        if (isPayInvoice) {
            store.dispatch(updateInvoiceStatusThunk());
            store.dispatch(setShowPayModal(false));
            store.dispatch(getReceivedInvoicesThunk());
        }
        successToastContent(
            `Create onetime payments success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }
    if (isPayInvoice) {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.updateInvoiceStatus,
            att: processKeys.processing,
            value: false
        }))
    } else {
        store.dispatch(updateProcessStatus({
            actionName: actionNames.createOneTimePayments,
            att: processKeys.processing,
            value: false
        }))
    }
    
}

export const eWithdrawFromPaymentRequest = async (account: string, requestId: number, amount: number) => {
    try {

        await checkAndRequireConnect();

        let contract = getWriteContract();
        console.log(requestId, amount);
        const withdrawRequest = await contract.withdrawFromPaymentRequest(
            requestId,
            ethers.utils.parseUnits(amount.toString(), 18)
        )

        let result = await withdrawRequest.wait();
        let withdrawEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', withdrawEvent.transactionHash);
        console.log('- Account:', account);
        console.groupEnd();
        successToastContent(
            `Withdraw success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.withdrawPayment,
        att: processKeys.processing,
        value: false
    }))
    store.dispatch(getReceivedPaymentRequestsThunk());
    store.dispatch(setShowWithdrawModal(false));
}

export const eCancelPaymentRequest = async (account: string, requestId: number) => {
    try {
        await checkAndRequireConnect();

        let contract = getWriteContract();
        const cancelRequest = await contract.cancelPaymentRequest(
            requestId
        )

        let result = await cancelRequest.wait();
        let cancelEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', cancelEvent.transactionHash);
        console.log('- RequestId:', requestId);
        console.groupEnd();
        successToastContent(
            `Cancel request success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.cancel,
        att: processKeys.processing,
        value: false
    }))
    store.dispatch(getReceivedPaymentRequestsThunk());
    store.dispatch(getSenderPaymentRequestsThunk());
    store.dispatch(setShowCancelModal(false));
}

export const eTransferPaymentRequest = async (account: string, requestId: number, to: string) => {
    try {

        await checkAndRequireConnect();

        let contract = getWriteContract();
        const transferRequest = await contract.transferPaymentRequest(
            requestId,
            to
        )

        let result = await transferRequest.wait();
        let transferEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', transferEvent.transactionHash);
        console.log('- RequestId:', requestId);
        console.groupEnd();
        successToastContent(
            `Transfer request success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.transfer,
        att: processKeys.processing,
        value: false
    }))
    store.dispatch(getReceivedPaymentRequestsThunk());
    store.dispatch(getSenderPaymentRequestsThunk());
    store.dispatch(setShowTransferModal(false));
}

export const eWithdrawFromBalance = async (account: string, tokenAddress: string, amount: number) => {
    try {
        await checkAndRequireConnect();
        let contract = getWriteContract();
        const withdrawRequest = await contract.withdrawBalance(
            tokenAddress,
            ethers.utils.parseUnits(amount.toString(), 18)
        )

        let result = await withdrawRequest.wait();
        let withdrawEvent = result.events[0];
        console.group();
        console.log('- Event Name:', "Deposit");
        console.log('- Transaction hash:', withdrawEvent.transactionHash);
        console.log('- tokenAddress:', tokenAddress);
        console.groupEnd();
        successToastContent(
            `Withdraw success`,
            ``,
        )
    } catch (e) {
        console.log(e);
        errorToastContent(e);
    }

    store.dispatch(updateProcessStatus({
        actionName: actionNames.withdrawBalance,
        att: processKeys.processing,
        value: false
    }))

}

export const eGetSenderPaymentRequests = async (address: string) => {
    let contract = getReadContract();
    let senderRequests = await contract.getSenderRequests({ from: address });
    let requests = [];
    for (let i = 0; i < senderRequests.length; i++) {
        requests.push(convertPaymentRequest(senderRequests[i]));
    }
    return requests;
}

export const eGetRecipientPaymentRequests = async (address: string) => {
    let contract = getReadContract();
    let recipientRequests = await contract.getRecipientRequests({ from: address });
    let requests = [];
    for (let i = 0; i < recipientRequests.length; i++) {
        requests.push(convertPaymentRequest(recipientRequests[i]));
    }
    return requests;
}

export const eGetUserTokensBalance = async (account: string) => {

    let balances = [];
    if (!account) {
        return balances;
    }
    try {
        let contract = getReadContract();
        let tokensBalance = await contract.getUserTokensBalance({ from: account });
        for (let i = 0; i < tokensBalance.length; i++) {
            balances.push({
                name: tokenAddressInfo[DEFAULT_CHAIN][tokensBalance[i].tokenAddress].name,
                address: tokensBalance[i].tokenAddress,
                balance: ethers.utils.formatUnits(tokensBalance[i].balance._hex, 18),
                lockedAmount: ethers.utils.formatUnits(tokensBalance[i].lockedAmount._hex, 18)
            })
        }
    } catch (e) {
        console.log(e);
    }

    return balances;
}



const convertPaymentRequest = (pr) => {
    const convertedPaymentRequest: PaymentRequest = {
        requestId: parseInt(pr.requestId, 16),
        sender: pr.sender,
        tokenAddress: pr.tokenAddress,
        isNativeToken: pr.isNativeToken,
        startDate: parseInt(pr.startDate._hex) * 1000,
        paymentAmount: parseFloat(ethers.utils.formatUnits(pr.paymentAmount._hex, 18)),
        remainingBalance: parseFloat(ethers.utils.formatUnits(pr.remainingBalance._hex, 18)),
        prepaidPercentage: parseInt(pr.prepaidPercentage),
        unlockAmountPerTime: parseFloat(ethers.utils.formatUnits(pr.unlockAmountPerTime._hex, 18)),
        unlockEvery: parseInt(pr.unlockEvery._hex, 16),
        numberOfUnlocks: parseInt(pr.numberOfUnlocks._hex, 16),
        recipient: pr.recipient,
        whoCanCancel: parseInt(pr.whoCanCancel),
        whoCanTransfer: parseInt(pr.whoCanTransfer),
        status: parseInt(pr.status),
        transactionHash: ""
    }

    return convertedPaymentRequest;
}
