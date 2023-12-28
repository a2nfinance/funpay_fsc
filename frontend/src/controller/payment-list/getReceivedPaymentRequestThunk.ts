import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRecipientPaymentRequests } from "src/core";

import { AppState } from "../store";
export const getReceivedPaymentRequestsThunk = createAsyncThunk("recipient/get-payment-requests", async (_, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   let list = getRecipientPaymentRequests(state.network.account);

   return list;
})