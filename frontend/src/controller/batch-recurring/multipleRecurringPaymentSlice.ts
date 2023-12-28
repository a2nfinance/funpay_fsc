import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';

type Recipient = {
    recipient: string,
    unlockEvery: number,
    unlockEveryType: number,
    unlockAmountPerTime: number | string,
    numberOfUnlocks: number,
    prepaidPercentage: number
}
export type MultipleRecurringPaymentState = {
    generalSetting: {
        tokenAddress: string,
        isNativeToken: boolean,
        startDate: number,
        whoCanCancel: number,
        whoCanTransfer: number
    },
    recipients: Recipient[]
}

const initialState: MultipleRecurringPaymentState = {
    generalSetting: {
        tokenAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        isNativeToken: true,
        startDate: new Date().getTime(),
        whoCanCancel: 0,
        whoCanTransfer: 0
    },
    recipients: [
        {
            recipient: "",
            unlockEvery: 1,
            unlockEveryType: 1,
            unlockAmountPerTime: 1,
            numberOfUnlocks: 1,
            prepaidPercentage: 0

        }
    ]
}

export const multipleRecurringPaymentSlice = createSlice({
    name: 'multipleRecurringPayment',
    initialState,
    reducers: {
        changeGeneralSetting: (state: MultipleRecurringPaymentState, action: PayloadAction<{att: string, value: any}>) => {
            state.generalSetting[action.payload.att] = action.payload.value;
        },
        addNewRecipient: (state: MultipleRecurringPaymentState) => {
            state.recipients.push({
                recipient: "",
                unlockEvery: 1,
                unlockEveryType: 1,
                unlockAmountPerTime: 1,
                numberOfUnlocks: 1,
                prepaidPercentage: 0
    
            })
        },
        addNewRecipients: (state: MultipleRecurringPaymentState, action: PayloadAction<Recipient[]>) => {
            console.log(action.payload);
            state.recipients = state.recipients.concat(action.payload);
        },
        removeRecipient: (state: MultipleRecurringPaymentState, action: PayloadAction<{index: number}>) => {
            state.recipients.splice(action.payload.index, 1);
        },
        changeRecipient: (state: MultipleRecurringPaymentState, action: PayloadAction<{index: number, att: string, value: any}>) => {
            state.recipients[action.payload.index][action.payload.att] = action.payload.value;
        }
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        // builder.addCase(initContractThunk.fulfilled, (state, action) => {
        //     console.log("complete init contract");
        //     state.contract = action.payload;
        // })

    }
})

export const { changeGeneralSetting, changeRecipient, addNewRecipient, removeRecipient, addNewRecipients  } = multipleRecurringPaymentSlice.actions;

export default multipleRecurringPaymentSlice.reducer;