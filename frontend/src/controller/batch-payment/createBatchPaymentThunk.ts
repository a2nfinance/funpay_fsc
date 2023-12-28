import { createAsyncThunk } from "@reduxjs/toolkit";
import { createOneTimePayments } from "src/core";

import { AppState } from "../store";
export const createBatchPaymentThunk = createAsyncThunk("batchpay/create-payments", async (_, {getState}) => {
   // @ts-ignore
   let state: AppState = getState();
   createOneTimePayments(state.network.account, state.batchPayment, false);
})