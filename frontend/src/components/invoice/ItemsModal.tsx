import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { MdClear } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { setIsShowItems } from 'src/controller/invoice/invoiceSlice';
import { useInvoice } from 'src/hooks/useInvoice';

export default function ItemsModal() {
    const dispatch = useAppDispatch();
    const { getLineItemAmount, getInvoiceAmount } = useInvoice()
    const { isShowItems, currentItems } = useAppSelector(state => state.invoice)

    return (

        <Modal isOpen={isShowItems} size="full" onClose={() => dispatch(setIsShowItems(false))}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>INVOICE ITEMS</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <TableContainer>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Description</Th>
                                    <Th isNumeric>QTY</Th>
                                    <Th isNumeric>Unit Price</Th>
                                    <Th isNumeric>Discount (%)</Th>
                                    <Th isNumeric>Tax (%)</Th>
                                    <Th isNumeric>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    currentItems.map(item => {
                                        let lineItemAmount = getLineItemAmount(item);
                                        return (
                                            <Tr>
                                                <Td>{item.description}</Td>
                                                <Td isNumeric>{item.qty}</Td>
                                                <Td isNumeric>{item.unitPrice}</Td>
                                                <Td isNumeric>{item.discount}</Td>
                                                <Td isNumeric>{item.tax}</Td>
                                                <Td isNumeric>{lineItemAmount}</Td>
                                            </Tr>
                                        )
                                    })
                                }

                            </Tbody>
                            {
                                [1].map(() => {
                                    const { amountWithoutTax, totalTaxAmount, totalAmount, due } = getInvoiceAmount(currentItems);
                                    return (
                                        <Tfoot>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Amount Without Tax</Td>
                                                <Td isNumeric>{amountWithoutTax}</Td>
                                            </Tr>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Total Tax Amount</Td>
                                                <Td isNumeric>{totalTaxAmount}</Td>
                                            </Tr>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Total Amount</Td>
                                                <Td isNumeric>{totalAmount}</Td>
                                            </Tr>
                                            <Tr>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td></Td>
                                                <Td>Due</Td>
                                                <Td isNumeric>{due}</Td>
                                            </Tr>
                                        </Tfoot>
                                    )
                                })

                            }
                        </Table>
                    </TableContainer>
                </ModalBody>

                <ModalFooter>
                    <Button variant={"outline"} leftIcon={<MdClear />} colorScheme='blue' mr={3} onClick={() => dispatch(setIsShowItems(false))}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    )
}