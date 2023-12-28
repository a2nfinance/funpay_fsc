import { createAsyncThunk } from "@reduxjs/toolkit";
import { withdrawFromPaymentRequest } from "src/core";

import { AppState } from "../store";
export const withdrawPaymentRequestThunk = createAsyncThunk("paymentRequest/withdraw", async (amount: number, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   //return list;

   await withdrawFromPaymentRequest(state.network.account, state.paymentList.selectedPaymentRequest.requestId, amount);
})