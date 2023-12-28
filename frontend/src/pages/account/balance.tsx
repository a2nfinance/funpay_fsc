import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading, HStack,
    InputGroup,
    InputRightAddon,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Stack,
    Text
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../controller/hooks";

import BalanceTable from "src/components/balance/BalanceTable";
import { whiteListTokenOfChain } from "src/config/whitelistTokens";
import { updateBalanceAttribute } from "src/controller/balance/balanceSlice";
import { depositThunk } from "src/controller/balance/depositThunk";
import { withdrawBalanceThunk } from "src/controller/balance/withdrawBalanceThunk";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";


export default function Balance() {
    const dispatch = useAppDispatch();
    const {chain} = useAppSelector(state => state.network);
    const {deposit, withdrawBalance} = useAppSelector(state => state.process);
    
    const handleUpdate = useCallback((att: string, value: any) => {
        dispatch(updateBalanceAttribute({att: att, value: value}));
    }, [])

    const doDeposit = useCallback(async () => {
        dispatch(updateProcessStatus({
            actionName: actionNames.deposit,
            att: processKeys.processing,
            value: true
        }))
        dispatch(depositThunk());
    }, [])


    const doWithdraw = useCallback(() => {
        dispatch(updateProcessStatus({
            actionName: actionNames.withdrawBalance,
            att: processKeys.processing,
            value: true
        }))
        dispatch(withdrawBalanceThunk());
    }, [])

    return (
        <Card>
            <CardHeader>
               
                <p>My Balance</p>
                <Text color={'gray.500'} textTransform="none" fontSize={"14px"}>
                    This is your balance in FunPay smart contract using for payments only.
                </Text>
            </CardHeader>
            <CardBody>
            <HStack>
                <FormControl>
                    <FormLabel>Deposit Amount</FormLabel>
                    <InputGroup>
                        <NumberInput min={0}>
                            <NumberInputField onChange={e => handleUpdate("depositAmount", e.target.value)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <InputRightAddon p="0" children={<Select onChange={(e) => handleUpdate("depositToken", e.target.value)}>
                                {
                                    whiteListTokenOfChain[chain].map((token, index) => {
                                        return <option key={`deposit-token-${token.symbol}`} value={token.address}>{token.name}</option>
                                    })
                                }
                        </Select>}/>

                        <Button colorScheme={"purple"} variant="outline" isLoading={deposit.processing} size="lg" ml={2} onClick={() => doDeposit()}>
                            Deposit
                        </Button>

                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Withdraw Amount</FormLabel>
                    <InputGroup>
                        <NumberInput min={0} >
                            <NumberInputField onChange={e => handleUpdate("withdrawAmount", e.target.value)}/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <InputRightAddon p="0" children={<Select onChange={(e) => handleUpdate("withdrawToken", e.target.value)}>
                                {
                                    whiteListTokenOfChain[chain].map((token, index) => {
                                        return <option key={`withdraw-token-${token.symbol}`} value={token.address}>{token.name}</option>
                                    })
                                }
                        </Select>}/>
                        <Button colorScheme={"blue"} variant="outline"  isLoading={withdrawBalance.processing} ml={2} size="lg" onClick={() =>doWithdraw()}>
                            Withdraw
                        </Button>

                    </InputGroup>
                </FormControl>
            </HStack>
            <Stack spacing={4} marginBottom={5} mt={5}>
                <Heading
                    lineHeight={1.1}
                    fontSize={{ base: 'lg', sm: '2lg', md: '2lg' }}>
                    My Token Balances in FunPay smart contract
                </Heading>
                <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                    Including my current balance & locked amount using for payments.
                </Text>
            </Stack>

            
            <BalanceTable />
            </CardBody>
                                
        </Card>
    )
}