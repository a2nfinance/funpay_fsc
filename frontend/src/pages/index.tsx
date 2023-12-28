import { AddIcon, RepeatClockIcon } from "@chakra-ui/icons";
import { Box, Button, ButtonGroup, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
export default function Index() {
    const router = useRouter();
    return (

           <Box>
                <HStack alignItems={"center"}>
                    <VStack alignItems="flex-start">
                        <Heading size={"xl"} mb={5} lineHeight={1.2}>
                        Simplify Your Payments with FunPay
                        </Heading>
                        <Text noOfLines={[1, 2, 3]}>We simplify all payment processes for you, making sending and receiving funds with cryptocurrency easier and more straightforward. FunPay streamlines the movement of money, ensuring a user-friendly experience.</Text>
                        <br/>
                        <ButtonGroup gap={2}>
                            <Button onClick={() => router.push("/payment/one-time")} leftIcon={<AddIcon />} colorScheme="purple" variant={"outline"}>NEW ONETIME PAYMENT</Button>
                            <Button onClick={() => router.push("/payment/recurring")} leftIcon={<RepeatClockIcon />} colorScheme="blue" variant="ghost">NEW RECURRING PAYMENT</Button>
                        </ButtonGroup>
                    </VStack>
                    <VStack>
                        <Image minW={{base: 0, "xl": "700px"}} src="/crypto-payment.png"/>
                    </VStack>
                </HStack>
           </Box>

    )
}