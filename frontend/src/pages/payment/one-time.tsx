import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import OneTimePaymentForm from "src/components/onetime-payment/OneTimePaymentForm";
import Recipients from "src/components/onetime-payment/Recipients";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function OneTimePayment() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    useEffect(() => {
        dispatch(getAddressThunk());
    }, [account])
    return (
        <Box>
            <OneTimePaymentForm />
            <Recipients />
        </Box>
    )
}