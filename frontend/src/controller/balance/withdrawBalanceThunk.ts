import { createAsyncThunk } from "@reduxjs/toolkit";
import { withdrawFromBalance } from "src/core";

import { AppState } from "../store";
export const withdrawBalanceThunk = createAsyncThunk("balance/withdraw", async (_, {getState}) => {

   // @ts-ignore
   let state: AppState = getState();
   //return list;

   await withdrawFromBalance(state.network.account, state.balance.withdrawToken,  state.balance.withdrawAmount);
})