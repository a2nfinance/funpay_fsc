import ChangeStatusModal from "src/components/invoice/ChangeStatusModal";
import ItemsModal from "src/components/invoice/ItemsModal";
import SentInvoiceList from "src/components/invoice/SentInvoiceList";

export default function SentInvoice() {
    return (
        <>
         <SentInvoiceList />
         <ItemsModal />
         <ChangeStatusModal />
        </>
       

    )
}