import { createAsyncThunk } from "@reduxjs/toolkit";
import { depositNativeToken } from "src/core";

import { AppState } from "../store";
export const depositThunk = createAsyncThunk("balance/deposit", async (_, {getState}) => {
    // @ts-ignore
    let state: AppState = getState()
    await depositNativeToken(state.network.account, state.balance.depositAmount);
})