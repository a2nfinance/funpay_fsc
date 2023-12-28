import { createAsyncThunk } from "@reduxjs/toolkit";
import { cancelPaymentRequest } from "src/core";

import { AppState } from "../store";
export const cancelPaymentRequestThunk = createAsyncThunk("paymentRequest/cancel", async (_, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   //return list;
   await cancelPaymentRequest(state.network.account, state.paymentList.selectedPaymentRequest.requestId);
})