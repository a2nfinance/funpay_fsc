import { createAsyncThunk } from "@reduxjs/toolkit";

import { AppState } from "../store";
export const getAddressThunk = createAsyncThunk("addressBook/get-addresses", async (_, {getState}) => {

    // @ts-ignore
    let state: AppState = getState();
    if (state.network.account) {
        let request = await fetch(`/api/db/address/getList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                owner: state.network.account
            })
        });
        let groupList = await request.json();
        return groupList;
    } else {
        return [];
    }

    
})