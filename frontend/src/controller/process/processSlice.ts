import {
    ActionReducerMapBuilder,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import { saveAddressThunk } from "../address-book/saveAddressThunk";
import { saveGroupThunk } from "../address-book/saveGroupThunk";
import { withdrawBalanceThunk } from "../balance/withdrawBalanceThunk";
import { createInvoiceThunk } from "../invoice/createInvoiceThunk";
import { updateInvoiceStatusThunk } from "../invoice/updateInvoiceStatusThunk";

export const actionNames = {
    deposit: "deposit",
    withdrawBalance: "withdrawBalance",
    withdrawPayment: "withdrawPayment",
    cancel: "cancel",
    transfer: "transfer",
    createBatchPayments: "createBatchPayments",
    createOneTimePayments: "createOneTimePayments",
    saveAddressGroup: "saveAddressGroup",
    saveAddress: "saveAddress",
    createInvoice: "createInvoice",
    updateInvoiceStatus: "updateInvoiceStatus"
}

export const processKeys = {
    processing: "processing",
}

type Processes = {
    [key: string]:  {
        processing: boolean
    }
}

const initialState: Processes = {
    deposit: {
        processing: false
    },
    withdrawBalance:  {
        processing: false
    },
    withdrawPayment:  {
        processing: false
    },
    cancel:  {
        processing: false
    },
    transfer:  {
        processing: false
    },
    createBatchPayments:  {
        processing: false
    },
    createOneTimePayments:  {
        processing: false
    },
    saveAddressGroup:  {
        processing: false
    },
    saveAddress:  {
        processing: false
    },
    createInvoice: {
        processing: false
    },
    updateInvoiceStatus: {
        processing: false
    }
}

export const processesSlice = createSlice({
    name: 'process',
    initialState,
    reducers: {
        updateProcessStatus: (state, action: PayloadAction<{actionName: string, att: string, value: boolean}> ) => {
            state[action.payload.actionName][action.payload.att] = action.payload.value;
        },
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        builder.addCase(saveGroupThunk.fulfilled, (state: Processes, action) => {
            state.saveAddressGroup.processing = false;
        })

        builder.addCase(saveAddressThunk.fulfilled, (state: Processes, action) => {
            state.saveAddress.processing = false;
        })

        builder.addCase(createInvoiceThunk.fulfilled, (state: Processes, action) => {
            state.createInvoice.processing = false;
        })

        builder.addCase(updateInvoiceStatusThunk.fulfilled,  (state: Processes, action) => {
            state.updateInvoiceStatus.processing = false;
        })

        builder.addCase(withdrawBalanceThunk.fulfilled,  (state: Processes, action) => {
            state.withdrawBalance.processing = false;
        })

    }
})

export const { updateProcessStatus } = processesSlice.actions;
export default processesSlice.reducer;