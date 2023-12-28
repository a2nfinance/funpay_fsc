import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserTokensBalance } from "src/core";

import { AppState } from "../store";
export const getBalanceThunk = createAsyncThunk("balance/get-token-balances", async (_, {getState}) => {
    // @ts-ignore
    let state: AppState = getState()
    let balances = getUserTokensBalance(state.network.account);
    return balances;
})