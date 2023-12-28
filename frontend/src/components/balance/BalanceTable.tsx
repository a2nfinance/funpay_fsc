import { Table, TableContainer, Tag, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect } from "react";
import { getBalanceThunk } from "src/controller/balance/getBalanceThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
export default function BalanceTable() {
    const dispatch = useAppDispatch();
    const {tokenBalances} = useAppSelector(state => state.balance);
    const {deposit, withdrawBalance} = useAppSelector(state => state.process);
    async function fetchData() {
        await dispatch(getBalanceThunk());
     }
    useEffect(() => {
        fetchData()
    }, [deposit.processing, withdrawBalance.processing])
    return (
        <TableContainer w={"full"}>
                <Table variant={"striped"}>
                    <Thead>
                        <Tr>
                            <Th>Token</Th>
                            <Th isNumeric>Balance</Th>
                            <Th isNumeric>Locked Amount</Th>
                            <Th isNumeric>Available Amount</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            tokenBalances.map((token, index) => {
                                return (
                                    <Tr>
                                        <Td><Tag colorScheme={"purple"}>{token.name}</Tag></Td>
                                        <Td isNumeric>{token.balance}</Td>
                                        <Td isNumeric>{token.lockedAmount}</Td>
                                        <Td isNumeric><Tag colorScheme={"blue"}>{token.balance - token.lockedAmount}</Tag></Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
    )
}