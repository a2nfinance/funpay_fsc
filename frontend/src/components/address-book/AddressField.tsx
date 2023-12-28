import { FormControl, FormLabel, HStack, InputGroup, InputLeftAddon, Tag } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { RiWallet2Line } from "react-icons/ri";
import { useAppSelector } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";

export default function AddressField({ label, att, placeHolder, handleChange }) {
    const { addressList } = useAppSelector(state => state.addressBook);
    const { getShortAddress } = useAddress();
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <AutoComplete openOnFocus onChange={val => handleChange(att, val)} >
                <InputGroup>
                    <InputLeftAddon
                        pointerEvents='none'
                        children={<RiWallet2Line />}
                    />
                    <AutoCompleteInput />
                </InputGroup>
                <AutoCompleteList ml={10} mt={1}>
                    {addressList.map((address) => (
                        <AutoCompleteItem
                            key={`option-${address._id}`}
                            value={address.walletAddress}
                            textTransform="capitalize"
                        >
                            <HStack gap={2}>
                                {
                                    address.name ? <Tag>{address.name}</Tag> : <span></span>
                                }
                                <Tag colorScheme={"purple"}>{getShortAddress(address.walletAddress)}</Tag>
                                {
                                    address.email ? <Tag colorScheme={"blue"}>{address.email}</Tag> : <span></span>
                                }
                            </HStack>

                        </AutoCompleteItem>
                    ))}
                </AutoCompleteList>
            </AutoComplete>
        </FormControl>
    )
}