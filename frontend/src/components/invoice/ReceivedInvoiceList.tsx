import { SettingsIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Card,
    CardBody, CardFooter,
    CardHeader,
    IconButton,
    Menu, MenuButton,
    MenuItem,
    MenuList,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { chains } from 'src/config/chainSettings';
import { tokenAddressInfo } from 'src/config/whitelistTokens';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { getReceivedInvoicesThunk } from 'src/controller/invoice/getReceivedInvoicesThunk';
import { InvoiceItem, setCurrentItems, setIsShowItems, setSelectedInvoice, setShowPayModal, setStatusTo } from 'src/controller/invoice/invoiceSlice';
import { useAddress } from 'src/hooks/useAddress';
import { useInvoice } from 'src/hooks/useInvoice';
import { useStatus } from 'src/hooks/useStatus';
export default function ReceivedInvoiceList() {
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getInvoiceAmount, checkInvoiceActionable } = useInvoice();
    const { getInvoiceStatus } = useStatus();
    const { receivedInvoices } = useAppSelector(state => state.invoice);
    const { chain, account } = useAppSelector(state => state.network);
    const handleShowCurrentItems = useCallback((items: InvoiceItem[]) => {
        dispatch(setIsShowItems(true));
        dispatch(setCurrentItems(items));
    }, [])

    useEffect(() => {
        dispatch(getReceivedInvoicesThunk())
    }, [account])

    const handleUpdateInvoiceStatus = useCallback((selectedInvoice, status: number) => {
        dispatch(setShowPayModal(true)),
            dispatch(setSelectedInvoice(selectedInvoice));
        dispatch(setStatusTo(status));
    }, [])

    return (
        <Card>
            <CardHeader>
                Received Invoices
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Sender</Th>
                                <Th>Fiat</Th>
                                <Th>Items</Th>
                                <Th isNumeric>Tax</Th>
                                <Th isNumeric>Due</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                receivedInvoices.map((invoice) => {
                                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(invoice.recipient)} target="_blank">
                                        { getShortAddress(invoice.owner) }
                                    </a>
                                    let { due, totalTaxAmount } = getInvoiceAmount(invoice.items);
                                    let token = tokenAddressInfo[chain][invoice.tokenAddress];
                                    let tokenSymbol = token.symbol;
                                    let status = getInvoiceStatus(invoice.status);
                                    const {allowPay, allowReject} = checkInvoiceActionable(invoice, false);
                                    return (
                                        <Tr>
                                            <Td>
                                                <Avatar src={token.logo} />
                                            </Td>
                                            <Td><Tag colorScheme={"purple"}>{shortAddress}</Tag></Td>
                                            <Td>{invoice.fiat}</Td>
                                            <Td><Tag onClick={() => handleShowCurrentItems(invoice.items)} cursor={"pointer"} colorScheme={"purple"}>{invoice.items.length} item(s)</Tag></Td>
                                            <Td isNumeric>{totalTaxAmount} {tokenSymbol} </Td>
                                            <Td isNumeric><Tag colorScheme={"blue"}>{due} {tokenSymbol}</Tag></Td>
                                            <Td>{status}</Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton icon={<SettingsIcon />} as={IconButton} />
                                                    <MenuList>
                                                        <MenuItem isDisabled={!allowPay} onClick={() => handleUpdateInvoiceStatus(invoice, 5)}>Pay</MenuItem>
                                                        <MenuItem isDisabled={!allowReject} onClick={() => handleUpdateInvoiceStatus(invoice, 4)}>Reject</MenuItem>
                                                    </MenuList>
                                                </Menu></Td>
                                        </Tr>
                                    )
                                })
                            }

                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
            <CardFooter>
            </CardFooter>

        </Card>

    )
}