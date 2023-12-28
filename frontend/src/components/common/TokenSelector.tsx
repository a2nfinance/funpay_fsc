import { InputGroup, InputLeftAddon, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import {
    BiBitcoin
} from 'react-icons/bi';
import { whiteListTokenOfChain } from "src/config/whitelistTokens";
import { getBalanceThunk } from "src/controller/balance/getBalanceThunk";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function TokenSelector({handleOnChange}) {
    const {chain} = useAppSelector(state => state.network)
    const dispatch = useAppDispatch();
    const {tokenBalances} = useAppSelector(state => state.balance);
    useEffect(() => {
        dispatch(getBalanceThunk())
    }, [])
    return (
        <InputGroup>
        <InputLeftAddon children={<BiBitcoin />} />
        <Select required onChange={(e) => handleOnChange("tokenAddress", e.target.value)}>
            {
                whiteListTokenOfChain[chain].map((token) => {
                    let tokenBalance = tokenBalances.filter(i => i.address == token.address);
                    let availableAmount = 0;
                    if (tokenBalance.length) {
                        availableAmount = tokenBalance[0].balance - tokenBalance[0].lockedAmount;
                    }
                    return <option key={`option-${token.symbol}`} value={token.address}>
                        {token.name} ({availableAmount})
                        </option>
                })
            }
        </Select>
    
        </InputGroup>
    )
        
}