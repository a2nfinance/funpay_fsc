import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import Recipients from "src/components/recurring-payment/Recipients";
import RecurringPaymentForm from "src/components/recurring-payment/RecurringPaymentForm";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function RecurringPayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    useEffect(() => {
        dispatch(getAddressThunk());
    }, [account])
    return (
        <Box>
            <RecurringPaymentForm />
            <Recipients />
        </Box>
    )
}