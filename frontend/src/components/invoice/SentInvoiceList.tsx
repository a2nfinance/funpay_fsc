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
import { getSentInvoicesThunk } from 'src/controller/invoice/getSentInvoicesThunk';
import { InvoiceItem, setCurrentItems, setIsShowItems, setSelectedInvoice, setShowStatusModal, setStatusTo } from 'src/controller/invoice/invoiceSlice';
import { useAddress } from 'src/hooks/useAddress';
import { useInvoice } from 'src/hooks/useInvoice';
import { useStatus } from 'src/hooks/useStatus';
export default function SentInvoiceList() {
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getInvoiceAmount, checkInvoiceActionable } = useInvoice();
    const { getInvoiceStatus } = useStatus();
    const { sentInvoices } = useAppSelector(state => state.invoice);
    const { chain, account } = useAppSelector(state => state.network);
    const handleShowCurrentItems = useCallback((items: InvoiceItem[]) => {
        dispatch(setIsShowItems(true));
        dispatch(setCurrentItems(items));
    }, [])

    useEffect(() => {
        dispatch(getSentInvoicesThunk())
    }, [account])

    const handleUpdateInvoiceStatus = useCallback((selectedInvoice, status: number) => {
        dispatch(setShowStatusModal(true)),
            dispatch(setSelectedInvoice(selectedInvoice));
        dispatch(setStatusTo(status));
    }, [])

    return (
        <Card>
            <CardHeader>
                Sent Invoices
            </CardHeader>
            <CardBody>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Client</Th>
                                <Th>Fiat</Th>
                                <Th>Items</Th>
                                <Th>Tax</Th>
                                <Th>Due</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                sentInvoices.map((invoice) => {
                                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(invoice.recipient)} target="_blank">
                                        { getShortAddress(invoice.recipient) }
                                    </a>
                                    let { due, totalTaxAmount } = getInvoiceAmount(invoice.items);
                                    let token = tokenAddressInfo[chain][invoice.tokenAddress];
                                    let tokenSymbol = token.symbol;
                                    let status = getInvoiceStatus(invoice.status);
                                    const {allowPause, allowCancel, allowActive} = checkInvoiceActionable(invoice, true);
                                    return (
                                        <Tr>
                                            <Td>
                                                <Avatar src={token.logo} />
                                            </Td>
                                            <Td><Tag colorScheme={"purple"}>{shortAddress}</Tag></Td>
                                            <Td>{invoice.fiat}</Td>
                                            <Td><Tag onClick={() => handleShowCurrentItems(invoice.items)} cursor={"pointer"} colorScheme={"purple"}>{invoice.items.length} item(s)</Tag></Td>
                                            <Td>{totalTaxAmount} {tokenSymbol} </Td>
                                            <Td><Tag colorScheme={"blue"}>{due} {tokenSymbol}</Tag></Td>
                                            <Td>{status}</Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton icon={<SettingsIcon />} as={IconButton} />
                                                    <MenuList>
                                                        <MenuItem isDisabled={!allowCancel} onClick={() => handleUpdateInvoiceStatus(invoice, 2)}>Cancel</MenuItem>
                                                        <MenuItem isDisabled={!allowPause} onClick={() => handleUpdateInvoiceStatus(invoice, 3)}>Pause</MenuItem>
                                                        <MenuItem isDisabled={!allowActive} onClick={() => handleUpdateInvoiceStatus(invoice, 1)}>Active</MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
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