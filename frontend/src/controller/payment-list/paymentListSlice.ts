import { ActionReducerMapBuilder, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getReceivedPaymentRequestsThunk } from './getReceivedPaymentRequestThunk';
import { getSenderPaymentRequestsThunk } from './getUserPaymentRequestThunk';

export type PaymentRequestOrigin = {
    requestId: string,
    sender: string,
    tokenAddress: string,
    isNativeToken: string,
    startDate: string,
    paymentAmount: string,
    remainingBalance: string,
    prepaidPercentage: string,
    unlockAmountPerTime: string,
    unlockEvery: string,
    numberOfUnlocks: string,
    recipient: string,
    whoCanCancel: string,
    whoCanTransfer: string,
    status: string,
}

export type PaymentRequest = {
    requestId: number,
    sender: string,
    tokenAddress: string,
    isNativeToken: boolean,
    startDate: number,
    paymentAmount: number,
    remainingBalance: number,
    prepaidPercentage: number,
    unlockAmountPerTime: number,
    unlockEvery: number,
    numberOfUnlocks: number,
    recipient: string,
    whoCanCancel: number,
    whoCanTransfer: number,
    status: number,
    transactionHash?: string
}

type InitialState = {
    paymentRequests: PaymentRequest[],
    receivedPaymentRequests: PaymentRequest[],
    showCancelModal: boolean,
    showWithdrawModal: boolean,
    showTransferModal: boolean,
    selectedPaymentRequest: PaymentRequest
}

const initialState: InitialState = {
    paymentRequests: [],
    receivedPaymentRequests: [],
    showCancelModal: false,
    showWithdrawModal: false,
    showTransferModal: false,
    selectedPaymentRequest: null
}


export const paymentListSlice = createSlice({
    name: 'paymentList',
    initialState,
    reducers: {
        setSelectedPaymentRequest: (state: InitialState, action: PayloadAction<PaymentRequest>) => {
            state.selectedPaymentRequest = action.payload;
        },
        setShowCancelModal: (state: InitialState, action: PayloadAction<boolean>) => {
            state.showCancelModal = action.payload;
        },
        setShowWithdrawModal: (state: InitialState, action: PayloadAction<boolean>) => {
            state.showWithdrawModal = action.payload;
        },
        setShowTransferModal: (state: InitialState, action: PayloadAction<boolean>) => {
            state.showTransferModal = action.payload;
        }
    },
    extraReducers(builder: ActionReducerMapBuilder<any>) {
        builder.addCase(getSenderPaymentRequestsThunk.fulfilled, (state: InitialState, action) => {
            state.paymentRequests = action.payload;
        })
        builder.addCase(getReceivedPaymentRequestsThunk.fulfilled, (state: InitialState, action) => {
            state.receivedPaymentRequests = action.payload;
        })
        

    }
})

export const { setSelectedPaymentRequest, setShowCancelModal, setShowWithdrawModal, setShowTransferModal} = paymentListSlice.actions;

export default paymentListSlice.reducer;