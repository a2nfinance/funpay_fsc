import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBalanceThunk } from "./getBalanceThunk";

type TokenBalance = {
    name: string,
    address?: string,
    balance: number,
    lockedAmount: number
}

type InitialState = {
    depositAmount: number,
    depositToken: string,
    withdrawAmount: number,
    withdrawToken: string,
    tokenBalances: TokenBalance[]
}

const initialState: InitialState = {
    depositAmount: null,
    depositToken: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    withdrawAmount: null,
    withdrawToken: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    tokenBalances: []
}

export const balanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        updateBalanceAttribute: (state, action: PayloadAction<{att: string, value: string | number}> ) => {
            state[action.payload.att] = action.payload.value;
        },
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        builder.addCase(getBalanceThunk.fulfilled, (state: InitialState, action: PayloadAction<any>) => {
            state.tokenBalances = action.payload;
        })
    }
})

export const { updateBalanceAttribute } = balanceSlice.actions;
export default balanceSlice.reducer;