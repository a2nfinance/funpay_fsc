import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type GeneralSetting = {
    tokenAddress: string,
    isNativeToken: boolean,
    startDate: number,
    isPayNow: boolean
}

type Recipient = {
    recipient: string,
    amount: number | string
}

export type BatchPaymentState = {
    generalSetting: GeneralSetting,
    recipients: Recipient[]

}
const initialState: BatchPaymentState = {
    generalSetting: {
        tokenAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        isNativeToken: true,
        startDate: new Date().getTime(),
        isPayNow: true
    },
    recipients: [{
        recipient: "",
        amount: null
    }]
}

const batchPaymentSlice = createSlice({
    name: "batchPayment",
    initialState,
    reducers: {
        changeGeneralSetting: (state: BatchPaymentState, action: PayloadAction<{att: string, value: any}>) => {
            state.generalSetting[action.payload.att] = action.payload.value;
        },
        addNewRecipient: (state: BatchPaymentState) => {
            state.recipients.push({
                recipient: "",
                amount: null
    
            })
        },
        removeRecipient: (state: BatchPaymentState, action: PayloadAction<{index: number}>) => {
            state.recipients.splice(action.payload.index, 1);
        },
        changeRecipient: (state: BatchPaymentState, action: PayloadAction<{index: number, att: string, value: any}>) => {
            state.recipients[action.payload.index][action.payload.att] = action.payload.value;
        }
    }
})

export const { changeGeneralSetting, changeRecipient, addNewRecipient, removeRecipient  } = batchPaymentSlice.actions;

export default batchPaymentSlice.reducer;