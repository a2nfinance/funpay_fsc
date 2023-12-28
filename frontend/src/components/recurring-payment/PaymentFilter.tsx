import { Box, FormControl, FormLabel, HStack, Input, InputGroup } from "@chakra-ui/react";

export default function PaymentFilter() {
    return (
        <Box>
            <HStack>
                <FormControl>
                    <FormLabel>Type</FormLabel>
                    <InputGroup>
                        <Input type={"text"} placeholder="type" />
                    </InputGroup>
                </FormControl>
            </HStack>
        </Box>
    )
}