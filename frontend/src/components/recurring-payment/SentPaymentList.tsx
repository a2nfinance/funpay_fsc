import { RepeatIcon, SettingsIcon } from '@chakra-ui/icons';
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
    Tag, TagLabel, TagRightIcon,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { chains } from 'src/config/chainSettings';
import { tokenAddressInfo } from 'src/config/whitelistTokens';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { PaymentRequest, setSelectedPaymentRequest, setShowCancelModal, setShowTransferModal } from 'src/controller/payment-list/paymentListSlice';
import { useAddress } from 'src/hooks/useAddress';
import { usePaymentRequest } from 'src/hooks/usePaymentRequest';
import { useStatus } from 'src/hooks/useStatus';
import PaymentProcess from './PaymentProcess';
export default function SentPaymentList() {
    const dispatch = useAppDispatch();
    const { getShortAddress } = useAddress();
    const { getUnlockSetting } = usePaymentRequest();
    const { getStatus, checkPaymentDisabledActions } = useStatus();
    const { paymentRequests } = useAppSelector(state => state.paymentList);
    const { chain } = useAppSelector(state => state.network);

    const handleCancel = useCallback((item: PaymentRequest) => {
        dispatch(setShowCancelModal(true));
        dispatch(setSelectedPaymentRequest(item));
    }, [])

    const handleTransfer = useCallback((item: PaymentRequest) => {
        dispatch(setShowTransferModal(true));
        dispatch(setSelectedPaymentRequest(item));
    }, [])

    return (
        <Card>
            <CardHeader>
                Sent Payments
            </CardHeader>
            <CardBody px={0}>
                <TableContainer>
                    <Table variant='striped' colorScheme={"blackAlpha"}>
                        <Thead>
                            <Tr>
                                <Th>Token</Th>
                                <Th>Recipient</Th>
                                <Th>Start At</Th>
                                <Th isNumeric>Withdrew</Th>
                                <Th isNumeric>Unlocked</Th>
                                <Th>Unlock Settings</Th>
                                <Th isNumeric>Prepaid (%)</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                paymentRequests.map((p: PaymentRequest, index) => {
                                    let startDate = new Date(p.startDate).toLocaleString();
                                    let token = tokenAddressInfo[chain][p.tokenAddress];
                                    let { unlockSettings } = getUnlockSetting(p);
                                    let status = getStatus(p.status);
                                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(p.recipient)} target="_blank">
                                        {getShortAddress(p.recipient)}
                                    </a>
                                    let { isAllowCancel, isAllowTransfer } = checkPaymentDisabledActions(p, true);
                                    return (
                                        <Tr key={`received-payment-${p.requestId}`}>
                                            <Td>
                                                <Avatar src={token.logo} />
                                            </Td>
                                            <Td><Tag colorScheme={"purple"}>{shortAddress}</Tag></Td>
                                            <Td fontSize={"sm"}>{startDate}</Td>
                                            <Td isNumeric>
                                                <Tag colorScheme={"pink"}>
                                                    <TagLabel>
                                                        {p.paymentAmount - p.remainingBalance}
                                                    </TagLabel>
                                                </Tag>
                                            </Td>
                                            <Td isNumeric>
                                                <Tag colorScheme={"purple"}>
                                                    <TagLabel>
                                                       <PaymentProcess  key={`sent-payment-${index}`} payment={p} />
                                                    </TagLabel>
                                                </Tag>

                                            </Td>
                                            <Td>
                                                <Tag colorScheme={"blue"}>
                                                    <TagLabel>
                                                        {unlockSettings}
                                                    </TagLabel>
                                                    <TagRightIcon as={RepeatIcon} />
                                                </Tag>

                                            </Td>
                                            <Td isNumeric>{p.prepaidPercentage}</Td>
                                            <Td fontSize={"sm"}>{status}</Td>
                                            <Td>
                                                <Menu>
                                                    <MenuButton icon={<SettingsIcon />} as={IconButton} />
                                                    <MenuList>
                                                        <MenuItem onClick={() => handleCancel(p)} isDisabled={!isAllowCancel}>Cancel</MenuItem>
                                                        <MenuItem onClick={() => handleTransfer(p)} isDisabled={!isAllowTransfer}>Transfer</MenuItem>
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