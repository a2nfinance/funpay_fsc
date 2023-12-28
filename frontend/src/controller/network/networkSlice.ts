import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
export const networkSlice = createSlice({
    name: 'network',
    initialState: {
        networkId: 201022,
        chain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN,
        account: "",
        isConnected: false,
        contract: null
    },
    reducers: {
        setIsConnected: (state, isConnected) => {
            state.isConnected = isConnected.payload;
        },
        setAccount: (state, accountChanged) => {
            state.account = accountChanged.payload;
        }
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        // builder.addCase(initContractThunk.fulfilled, (state, action) => {
        //     console.log("complete init contract");
        //     state.contract = action.payload;
        // })

    }
})

export const { setIsConnected, setAccount } = networkSlice.actions;

export default networkSlice.reducer;