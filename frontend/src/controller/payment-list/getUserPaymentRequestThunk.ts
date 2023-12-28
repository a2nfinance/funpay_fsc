import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSenderPaymentRequests } from "src/core";

import { AppState } from "../store";
export const getSenderPaymentRequestsThunk = createAsyncThunk("sender/get-payment-requests", async (_, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
    
   let list = getSenderPaymentRequests(state.network.account);

   return list;
})