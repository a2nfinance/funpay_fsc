import { DeleteIcon, MinusIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
    Button,
    ButtonGroup,
    FormControl, IconButton, Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    TableContainer,
    Tbody,
    Td, Tfoot,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { addNewItem, changeItem, removeItem } from "src/controller/invoice/invoiceSlice";
import { useInvoice } from "../../hooks/useInvoice";

export default function InvoiceItems() {
    const { getLineItemAmount, getInvoiceAmount } = useInvoice();
    const dispatch = useAppDispatch();
    const invoiceData = useAppSelector(state => state.invoice);
    const { items } = useAppSelector(state => state.invoice)
    const handleChangeItem = useCallback((index: number, att: string, value: any) => {
        dispatch(changeItem({ index, att, value }));
    }, [])

    const handleAddItem = useCallback(() => {
        dispatch(addNewItem());
    }, [])

    const handleRemoveItem = useCallback((index: number) => {
        dispatch(removeItem({ index }));
    }, []);
    return (
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Description</Th>
                        <Th>Qty</Th>
                        <Th>Unit Price</Th>
                        <Th>Discount</Th>
                        <Th>Tax</Th>
                        <Th isNumeric>Amount</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        items.map((item, index) => {
                            let lineItemAmount = getLineItemAmount(item);
                            return (
                                <Tr key={`invoice-item-${index}`}>
                                    <Td>
                                        <FormControl>
                                            <InputGroup>
                                                <Input type='text' value={item.description} onChange={(e) => handleChangeItem(index, "description", e.target.value)} />
                                            </InputGroup>
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl>
                                            <InputGroup>
                                                <NumberInput value={item.qty} min={0}>
                                                    <NumberInputField onChange={(e) => handleChangeItem(index, "qty", e.target.value)} />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </InputGroup>
                                        </FormControl>

                                    </Td>
                                    <Td>
                                        <FormControl>
                                            <InputGroup>
                                                <NumberInput value={item.unitPrice} min={0}>
                                                    <NumberInputField onChange={(e) => handleChangeItem(index, "unitPrice", e.target.value)} />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </InputGroup>
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl>
                                            <InputGroup>
                                                <InputLeftElement pointerEvents={"none"} children={<MinusIcon fontSize={"xs"} />} />
                                                <Input type={"number"} value={item.discount} onChange={(e) => handleChangeItem(index, "discount", e.target.value)} />

                                                <InputRightAddon pointerEvents={"none"} children="%" />
                                            </InputGroup>
                                        </FormControl>
                                    </Td>
                                    <Td>
                                        <FormControl>
                                            <InputGroup>
                                                <InputLeftElement pointerEvents={"none"} children={<SmallAddIcon />} />
                                                <Input type='number' value={item.tax} onChange={(e) => handleChangeItem(index, "tax", e.target.value)} />
                                                <InputRightAddon pointerEvents={"none"} children="%" />
                                            </InputGroup>
                                        </FormControl>
                                    </Td>
                                    <Td isNumeric>{lineItemAmount}</Td>
                                    <Td>
                                        <ButtonGroup>

                                            <IconButton onClick={() => handleRemoveItem(index)} aria-label='Remove Recipient' icon={<DeleteIcon />} />

                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            )
                        })
                    }


                </Tbody>
                {
                    [1].map(() => {
                        const { amountWithoutTax, totalTaxAmount, totalAmount, due } = getInvoiceAmount(items);
                        return (
                            <Tfoot>
                                <Tr>
                                    <Td><Button onClick={() => handleAddItem()} leftIcon={<SmallAddIcon />} colorScheme="purple" variant={"ghost"}>New Item</Button></Td>
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
    )
}