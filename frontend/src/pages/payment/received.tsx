import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import ActionBar from "src/components/recurring-payment/ActionBar";
import CancelModal from "src/components/recurring-payment/CancelModal";
import ReceivedPaymentList from "src/components/recurring-payment/ReceivedPaymentList";
import TransferModal from "src/components/recurring-payment/TransferModal";
import WithdrawModal from "src/components/recurring-payment/WithdrawModal";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getReceivedPaymentRequestsThunk } from "src/controller/payment-list/getReceivedPaymentRequestThunk";

export default function ReceivedPayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    async function fetchData() {
       await dispatch(getReceivedPaymentRequestsThunk());
    }
    useEffect(() => {
        fetchData();
    }, [account])
    return (
        <Box>
            <ActionBar />
            <ReceivedPaymentList />
            <CancelModal />
            <TransferModal />
            <WithdrawModal />
        </Box>
    )
}