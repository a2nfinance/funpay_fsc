import { createAsyncThunk } from "@reduxjs/toolkit";

import { AppState } from "../store";
export const getSentInvoicesThunk = createAsyncThunk("invoice/get-sent-invoices", async (_, {getState}) => {

   // @ts-ignore
    let state: AppState = getState();
    let request = await fetch(`/api/db/invoice/getSentInvoices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: state.network.account
        })
    });
    let invoices = await request.json();
    return invoices;
})