import { DeleteIcon } from '@chakra-ui/icons';
import {
    Card,
    CardBody, CardFooter,
    CardHeader,
    IconButton,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { chains } from 'src/config/chainSettings';
import { getAddressThunk } from 'src/controller/address-book/getAddressesThunk';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { useAddress } from 'src/hooks/useAddress';
export default function AddressList() {
    const {getShortAddress} = useAddress();
    const dispatch = useAppDispatch();
    const {addressList, groupMap} = useAppSelector(state => state.addressBook);
    const process = useAppSelector(state => state.process);
    const {chain} = useAppSelector(state => state.network);
    useEffect(() => {
        dispatch(getAddressThunk())
    }, [process.saveAddress.processing]) 
    return (
        <Card>
            <CardHeader>
                Addresses
            </CardHeader>
            <CardBody px={0}>
                <TableContainer>
                    <Table variant='striped' colorScheme={"blackAlpha"}>
                        <Thead>
                            <Tr>
                                <Th>Full Name</Th>
                                <Th>Address</Th>
                                <Th>Email</Th>
                                <Th>Group</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                addressList.map((address) => {
                                    let shortAddress = <a href={chains[chain].explorer.concat("address/").concat(address.walletAddress)} target="_blank">
                                        {getShortAddress(address.walletAddress)}
                                    </a>
                                    return (
                                        <Tr>
                                            <Td>{address.name}</Td>
                                            <Td><Tag colorScheme={"purple"}>{shortAddress}</Tag></Td>
                                            <Td><Tag colorScheme={"blue"}>{address.email}</Tag></Td>
                                            <Td>{groupMap ? groupMap[address.groupId] : ""}</Td>
                                            <Td><IconButton aria-label='delete' icon={<DeleteIcon />} /></Td>
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