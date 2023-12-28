import { createAsyncThunk } from "@reduxjs/toolkit";
import { transferPaymentRequest } from "src/core";

import { AppState } from "../store";

export const transferPaymentRequestThunk = createAsyncThunk("paymentRequest/transfer", async (to: string, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   await transferPaymentRequest(state.network.account, state.paymentList.selectedPaymentRequest.requestId, to);
})