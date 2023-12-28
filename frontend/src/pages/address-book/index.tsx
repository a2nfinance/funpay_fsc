import {
    SimpleGrid,
    VStack
} from "@chakra-ui/react";
import AddressForm from "../../components/address-book/AddressForm";
import AddressList from "../../components/address-book/AddressList";
import GroupForm from "../../components/address-book/GroupForm";

export default function Index() {
    return (
        <VStack>
            <SimpleGrid gap={10} columns={2}>
            <AddressForm />
            <GroupForm />
        </SimpleGrid>
            <AddressList/>
        </VStack>
        
    )
}