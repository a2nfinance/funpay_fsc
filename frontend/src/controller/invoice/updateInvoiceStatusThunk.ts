import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorToastContent, successToastContent } from "src/config/toastContent";

import { AppState } from "../store";
export const updateInvoiceStatusThunk = createAsyncThunk("invoice/update-status", async (_, { getState }) => {

    // @ts-ignore
    let state: AppState = getState();

    let account = state.network.account;
    try {
        fetch(`/api/db/invoice/updateStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: state.invoice.selectedInvoice._id,
                status: state.invoice.changeStatusTo
            })
        });
        successToastContent(
            `Update the invoice status success`,
            ``,
        )
        return true;
    } catch (e) {
        errorToastContent(e);
        return false;
    }
})