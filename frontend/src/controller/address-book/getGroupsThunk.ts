import { createAsyncThunk } from "@reduxjs/toolkit";

import { AppState } from "../store";
export const getGroupsThunk = createAsyncThunk("addressBook/get-groups", async (_, {getState}) => {

   // @ts-ignore
    let state: AppState = getState();
    let request = await fetch(`/api/db/address-group/getList`, {
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
})