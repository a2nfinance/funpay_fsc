import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";

import { AppState } from "../store";
export const createInvoiceThunk = createAsyncThunk("invoice/save", async (_, { getState }) => {

    // @ts-ignore
    let state: AppState = getState();

    let account = state.network.account;

    try {
        let invoiceData = {
            ...state.invoice.generalSetting,
            owner: account,
            items: state.invoice.items
        }

        fetch(`/api/db/invoice/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });
        successToastContent(
            `Create new invoice success`,
            ``,
        )
        return true;
    } catch (e) {
        errorToastContent(e);
        return false;
    }
})