import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
export const networkSlice = createSlice({
    name: 'network',
    initialState: {
        isHana: false,
        hasHana: false,
        isHanaEnabled: false,
        networkId: 0x02,
        chain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN,
        account: "",
        isConnected: false,
        contract: null
    },
    reducers: {
        M_SET_DAPP_NETWORK: (state, networkId) => {
            state.networkId = networkId.payload;
        },
        M_SET_DAPP_CONNECT: (state, connect) => {
            state.isConnected = connect.payload;
        },
        M_SET_DAPP_ENABLE: (state, isHanaEnabled) => {
            state.isHanaEnabled = isHanaEnabled.payload;
        },
        M_SET_DAPP_ACCOUNT: (state, dappAccount) => {
            state.account = dappAccount.payload;
            if (dappAccount) {
                state.isConnected = true;
            }
        },
        IS_HANA: (state, isHana) => {
            state.isHana = isHana.payload;
        },
        HAS_HANA: (state, hasHana) => {
            state.hasHana = hasHana.payload;
        },
        IS_HANA_ENABLED: (state, isEnabled) => {
            state.isHanaEnabled = isEnabled.payload;
        },
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        // builder.addCase(initContractThunk.fulfilled, (state, action) => {
        //     console.log("complete init contract");
        //     state.contract = action.payload;
        // })

    }
})

export const { M_SET_DAPP_NETWORK, M_SET_DAPP_CONNECT, M_SET_DAPP_ENABLE, M_SET_DAPP_ACCOUNT, IS_HANA, HAS_HANA, IS_HANA_ENABLED } = networkSlice.actions;

export default networkSlice.reducer;