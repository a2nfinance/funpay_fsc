import { CopyIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    IconButton,
    Input, InputGroup,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
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
import { createRecurringPaymentThunk } from 'src/controller/batch-recurring/createRecurringPaymentThunk';
import { addNewRecipient, changeRecipient, removeRecipient } from 'src/controller/batch-recurring/multipleRecurringPaymentSlice';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';
import AddressFieldForMultiRecipient from '../address-book/AddressFieldMultiRecipient';

export default function Recipients() {
    const { recipients } = useAppSelector(state => state.batchRecurring);
    const {createBatchPayments} = useAppSelector(state => state.process);
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
            actionName: actionNames.createBatchPayments,
            att: processKeys.processing,
            value: true
        }))
        dispatch(createRecurringPaymentThunk());
    }, [])

    return (

        <Card>
            <CardBody p={0}>
                <TableContainer>
                    <Table variant='simple'>
                        <TableCaption>
                            <ButtonGroup>
                                <Button variant={'ghost'} leftIcon={<BsPersonPlus />} colorScheme={"purple"} onClick={() => handleAddRecipient()}>ADD RECIPIENT</Button>
                                <Button variant={'ghost'} isLoading={createBatchPayments.processing} leftIcon={<SettingsIcon />} colorScheme="blue" onClick={() => handleSave()}>SAVE DATA</Button>
                            </ButtonGroup>
                        </TableCaption>
                        <Thead >
                            <Tr>
                                <Th>Recipient</Th>
                                <Th>Number of Unlocks</Th>
                                <Th>Unlock Amount</Th>
                                <Th>Unlock Every</Th>
                                <Th>Prepaid</Th>
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
                                                <NumberInput value={recipient.numberOfUnlocks}>
                                                    <NumberInputField  onChange={(e) => handleChangeRecipient(index, "numberOfUnlocks", e.target.value)} />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>

                                            </Td>
                                            <Td>

                                                <NumberInput value={recipient.unlockAmountPerTime}>
                                                    <NumberInputField onChange={(e) => handleChangeRecipient(index, "unlockAmountPerTime", e.target.value)} />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </Td>
                                            <Td>
                                                <InputGroup>
                                                    {/* <InputLeftAddon children={<RepeatClockIcon />} /> */}
                                                    <Input type={"number"} value={recipient.unlockEvery} onChange={(e) => handleChangeRecipient(index, "unlockEvery", e.target.value)} />
                                                    <InputRightAddon p={0} children={
                                                        <Select variant={'outline'} value={recipient.unlockEveryType} onChange={(e) => handleChangeRecipient(index, "unlockEveryType", e.target.value)} fontSize={"14px"}>
                                                            <option value={1}>Second</option>
                                                            <option value={60}>Minute</option>
                                                            <option value={3600}>Hour</option>
                                                            <option value={86400}>Day</option>
                                                            <option value={604800}>Week</option>
                                                            <option value={2592000}>Month</option>
                                                            <option value={31536000}>Year</option>
                                                        </Select>
                                                    } />
                                                </InputGroup>
                                            </Td>
                                            <Td>
                                                <InputGroup>
                                                    <Input type={"number"} value={recipient.prepaidPercentage} onChange={(e) => handleChangeRecipient(index, "prepaidPercentage", e.target.value)} />
                                                    <InputRightAddon children={"%"} />
                                                </InputGroup>
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
                            {/* <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr> */}
                        </Tfoot>
                    </Table>

                </TableContainer>
            </CardBody>
        </Card>


    )
}