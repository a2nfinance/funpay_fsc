import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAddressThunk } from './getAddressesThunk';
import { getGroupsThunk } from './getGroupsThunk';

type Group = {
    _id?: string,
    owner: string,
    name: string,
    description?: string,
    status: boolean
}

type Address = {
    _id?: string,
    owner: string,
    walletAddress: string,
    name?: string,
    email?: string,
    groupId?: string,
    status: boolean
}

type InitialState = {
    group: Group,
    address: Address,
    groupList: Group[],
    addressList: Address[],
    groupMap: any
}

const initialState: InitialState = {
    group: {
        owner: "",
        name: "",
        status: true
    },
    address: {
        owner: "",
        walletAddress: "",
        status: true
    },
    groupList: [],
    addressList: [],
    groupMap: null
}


export const addressBookSlice = createSlice({
    name: 'addressBook',
    initialState,
    reducers: {
        setGroupAttribute: (state, action: PayloadAction<{att: string, value: string | number}> ) => {
            state.group[action.payload.att] = action.payload.value;
        },
        setAddressAttribute: (state, action: PayloadAction<{att: string, value: string | number}> ) => {
            state.address[action.payload.att] = action.payload.value;
        },
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        builder.addCase(getAddressThunk.fulfilled, (state: InitialState, action) => {
            state.addressList = action.payload;
        })
        builder.addCase(getGroupsThunk.fulfilled, (state: InitialState, action) => {
            state.groupList = action.payload;
            let groupsObj = {};
            if (action.payload && action.payload.length) {
                for(let i = 0; i< action.payload.length; i++) {
                    groupsObj[action.payload[i]._id] = action.payload[i].name;
                }
                state.groupMap = groupsObj;
            }
        })
    }
})

export const {setGroupAttribute, setAddressAttribute } = addressBookSlice.actions;

export default addressBookSlice.reducer;