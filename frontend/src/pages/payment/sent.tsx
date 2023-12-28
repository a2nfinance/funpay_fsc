import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import ActionBar from "src/components/recurring-payment/ActionBar";
import CancelModal from "src/components/recurring-payment/CancelModal";
import SentPaymentList from "src/components/recurring-payment/SentPaymentList";
import TransferModal from "src/components/recurring-payment/TransferModal";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getSenderPaymentRequestsThunk } from "src/controller/payment-list/getUserPaymentRequestThunk";

export default function SentPayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    async function fetchData() {
       await dispatch(getSenderPaymentRequestsThunk());
    }
    useEffect(() => {
        fetchData();
    }, [account])
    return (
        <Box>
            <ActionBar />
            <SentPaymentList />
            <CancelModal />
            <TransferModal />
        </Box>
    )
}