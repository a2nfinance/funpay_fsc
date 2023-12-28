import ChangeStatusModal from "src/components/invoice/ChangeStatusModal";
import ItemsModal from "src/components/invoice/ItemsModal";
import PayModal from "src/components/invoice/PayModal";
import ReceivedInvoiceList from "src/components/invoice/ReceivedInvoiceList";

export default function ReceivedInvoice() {
    return (
        <>
         <ReceivedInvoiceList />
         <ItemsModal />
         <ChangeStatusModal />
         <PayModal />
        </>
       

    )
}