import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getReceivedInvoicesThunk } from "./getReceivedInvoicesThunk";
import { getSentInvoicesThunk } from "./getSentInvoicesThunk";


type GeneralSetting = {
    recipient: string,
    fiat: string,
    tokenAddress: string,
    category: string,
    tags: string
}

export type InvoiceItem = {
    description: string,
    qty: number,
    unitPrice: number,
    discount: number,
    tax: number
}

export type Invoice = {
    _id?: string,
    owner: string,
    recipient: string,
    fiat: string,
    tokenAddress: string,
    category: string,
    tags: string,
    createdAt?: string,
    items: InvoiceItem[],
    status: number
}

type InvoiceState = {
    generalSetting: GeneralSetting,
    items: InvoiceItem[],
    sentInvoices: Invoice[],
    receivedInvoices: Invoice[],
    isShowItems: boolean,
    currentItems: InvoiceItem[],
    isShowStatusModal: boolean,
    isShowPayModal: boolean,
    changeStatusTo: number,
    selectedInvoice: Invoice

}
const initialState: InvoiceState = {
    generalSetting: {
        recipient: "",
        fiat: "USD",
        tokenAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        category: "",
        tags: ""
    },
    items: [{
        description: "",
        qty: 1,
        unitPrice: 1,
        discount: 0,
        tax: 0
    }],
    sentInvoices: [],
    receivedInvoices: [],
    isShowItems: false,
    currentItems: [],
    isShowPayModal: false,
    isShowStatusModal: false,
    changeStatusTo: 1,
    selectedInvoice: null
}

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
        changeGeneralSetting: (state: InvoiceState, action: PayloadAction<{ att: string, value: string | number }>) => {
            state.generalSetting[action.payload.att] = action.payload.value;
        },
        addNewItem: (state: InvoiceState) => {
            state.items.push({
                description: "",
                qty: 1,
                unitPrice: 1,
                discount: 0,
                tax: 0

            })
        },
        removeItem: (state: InvoiceState, action: PayloadAction<{ index: number }>) => {
            state.items.splice(action.payload.index, 1);
        },
        changeItem: (state: InvoiceState, action: PayloadAction<{ index: number, att: string, value: any }>) => {
            state.items[action.payload.index][action.payload.att] = action.payload.value;
        },
        setIsShowItems: (state: InvoiceState, action: PayloadAction<boolean>) => {
            state.isShowItems = action.payload;
        },
        setCurrentItems: (state: InvoiceState, action: PayloadAction<InvoiceItem[]>) => {
            state.currentItems = action.payload;
        },
        setShowStatusModal: (state: InvoiceState, action: PayloadAction<boolean>) => {
            state.isShowStatusModal = action.payload;
        },
        setShowPayModal: (state: InvoiceState, action: PayloadAction<boolean>) => {
            state.isShowPayModal = action.payload;
        },
        setSelectedInvoice: (state: InvoiceState, action: PayloadAction<Invoice>) => {
            state.selectedInvoice = action.payload;
        },
        setStatusTo: (state: InvoiceState, action: PayloadAction<number>) => {
            state.changeStatusTo = action.payload;
        },
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        builder.addCase(getSentInvoicesThunk.fulfilled, (state: InvoiceState, action) => {
            state.sentInvoices = action.payload;
        })

        builder.addCase(getReceivedInvoicesThunk.fulfilled, (state: InvoiceState, action) => {
            state.receivedInvoices = action.payload;
        })

    }
})

export const { 
    changeGeneralSetting, 
    changeItem, 
    addNewItem, 
    removeItem, 
    setIsShowItems, 
    setCurrentItems,
    setShowStatusModal,
    setShowPayModal,
    setSelectedInvoice,
    setStatusTo,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;