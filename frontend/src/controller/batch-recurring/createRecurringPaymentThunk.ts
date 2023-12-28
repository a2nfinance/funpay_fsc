import { createAsyncThunk } from "@reduxjs/toolkit";
import { createdBatchRecurringPayments } from "src/core";

import { AppState } from "../store";
export const createRecurringPaymentThunk = createAsyncThunk("recurring/create-payments", async (_, {getState}) => {
   // @ts-ignore
   let state: AppState = getState();
   createdBatchRecurringPayments(state.network.account, state.batchRecurring);
})