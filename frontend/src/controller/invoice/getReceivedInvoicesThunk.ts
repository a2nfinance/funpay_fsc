import { createAsyncThunk } from "@reduxjs/toolkit";

import { AppState } from "../store";
export const getReceivedInvoicesThunk = createAsyncThunk("invoice/get-received-invoices", async (_, {getState}) => {

   // @ts-ignore
    let state: AppState = getState();
    let request = await fetch(`/api/db/invoice/getReceivedInvoices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipient: state.network.account
        })
    });
    let invoices = await request.json();
    return invoices;
})