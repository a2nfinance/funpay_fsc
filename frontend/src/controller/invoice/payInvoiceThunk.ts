import { createAsyncThunk } from "@reduxjs/toolkit";
import { tokenAddressInfo } from "src/config/whitelistTokens";
import { createOneTimePayments } from "src/core";
import { useInvoice } from "src/hooks/useInvoice";
import { BatchPaymentState } from "../batch-payment/batchPaymentSlice";

import { AppState } from "../store";
export const payInvoiceThunk = createAsyncThunk("invoice/pay-now", async (_, { getState }) => {
    const {getInvoiceAmount} = useInvoice();
    // @ts-ignore
    let state: AppState = getState();

    let account = state.network.account;
    let chain = state.network.chain;
    try {
        let selectedInvoice = state.invoice.selectedInvoice;
        let oneTimePaymentData: BatchPaymentState = {
            generalSetting: {
                tokenAddress: selectedInvoice.tokenAddress,
                isPayNow: true,
                startDate: new Date().getTime(),
                isNativeToken: tokenAddressInfo[chain][selectedInvoice.tokenAddress].isNative
            },
            recipients: [
                {
                    recipient: selectedInvoice.owner,
                    amount: getInvoiceAmount(selectedInvoice.items).due
                }
            ]
        }
        createOneTimePayments(state.network.account, oneTimePaymentData, true);
        return true;
    } catch (e) {
        return false;
    }
})