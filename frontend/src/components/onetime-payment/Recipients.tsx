import { CopyIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { BsPersonPlus } from 'react-icons/bs';
import { addNewRecipient, changeRecipient, removeRecipient } from 'src/controller/batch-payment/batchPaymentSlice';
import { createBatchPaymentThunk } from 'src/controller/batch-payment/createBatchPaymentThunk';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import AddressFieldForMultiRecipient from '../address-book/AddressFieldMultiRecipient';

export default function Recipients() {
    const { recipients } = useAppSelector(state => state.batchPayment);
    const { createOneTimePayments: createOneTimePaymentsProcess } = useAppSelector(state => state.process);
    const dispatch = useAppDispatch();

    const handleChangeRecipient = useCallback((index: number, att: string, value: any) => {
        dispatch(changeRecipient({ index, att, value }));
    }, [])

    const handleAddRecipient = useCallback(() => {
        dispatch(addNewRecipient());
    }, [])

    const handleRemoveRecipient = useCallback((index: number) => {
        dispatch(removeRecipient({ index }));
    }, []);

    const handleSave = useCallback(() => {
        dispatch(updateProcessStatus({
            actionName: actionNames.createOneTimePayments,
            att: processKeys.processing,
            value: true
        }))
        dispatch(createBatchPaymentThunk());
    }, [])

    return (

        <Card>
            <CardBody p={0}>
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>
                            <ButtonGroup>
                                <Button variant={'ghost'} leftIcon={<BsPersonPlus />} colorScheme={"purple"} onClick={() => handleAddRecipient()}>ADD RECIPIENT</Button>
                                <Button isLoading={createOneTimePaymentsProcess.processing} variant={'ghost'} leftIcon={<SettingsIcon />} colorScheme="blue" onClick={() => handleSave()}>EXECUTE</Button>
                            </ButtonGroup>
                        </TableCaption>
                        <Thead >
                            <Tr>
                                <Th>Recipient</Th>
                                <Th isNumeric>Amount</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                recipients.map((recipient, index) => {
                                    return (
                                        <Tr key={`recipient-${index}`}>
                                            <Td>
                                                <AddressFieldForMultiRecipient
                                                    att="recipient"
                                                    index={index}
                                                    value={recipient.recipient}
                                                    handleChange={handleChangeRecipient}
                                                />

                                            </Td>
                                            <Td>
                                                <NumberInput min={0}>
                                                    <NumberInputField value={recipient.amount} onChange={(e) => handleChangeRecipient(index, "amount", e.target.value)} />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>

                                            </Td>


                                            <Td>
                                                <ButtonGroup>

                                                    <IconButton onClick={() => handleRemoveRecipient(index)} aria-label='Remove Recipient' icon={<DeleteIcon />} />
                                                    <IconButton onClick={() => { }} aria-label='Copy Recipient' icon={<CopyIcon />} />
                                                </ButtonGroup>
                                            </Td>

                                        </Tr>
                                    )
                                })
                            }

                        </Tbody>
                        <Tfoot>
                        </Tfoot>
                    </Table>

                </TableContainer>
            </CardBody>
        </Card>


    )
}