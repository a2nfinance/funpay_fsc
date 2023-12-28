import { useEffect } from "react";
import { getAddressThunk } from "src/controller/address-book/getAddressesThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import InvoiceForm from "../../components/invoice/InvoiceForm";

export default function NewInvoice() {
    const dispatch = useAppDispatch();
    const {account} = useAppSelector(state => state.network);
    useEffect(() => {
        dispatch(getAddressThunk());
    }, [account])

    return (
        <InvoiceForm />
    )
}