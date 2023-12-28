import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import addressBookReducer from "src/controller/address-book/addressBookSlice";
import balanceReducer from "src/controller/balance/balanceSlice";
import batchPaymentReducer from "src/controller/batch-payment/batchPaymentSlice";
import multipleRecurringReducer from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import networkReducer from "src/controller/network/networkSlice";
import paymentListReducer from "src/controller/payment-list/paymentListSlice";
import processReducer from 'src/controller/process/processSlice';
import invoiceReducer from './invoice/invoiceSlice';

const persistConfig = {
    key: 'network',
    storage,
}
const network = persistReducer(persistConfig, networkReducer)
export function makeStore() {
    return configureStore({
        reducer: {
            network: network,
            batchRecurring: multipleRecurringReducer,
            paymentList: paymentListReducer,
            addressBook: addressBookReducer,
            process: processReducer,
            balance: balanceReducer,
            batchPayment: batchPaymentReducer,
            invoice: invoiceReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    })
}

export const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
    >

export const persistor  = persistStore(store)