import { AddIcon, RepeatClockIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function ActionBar() {
    const router = useRouter();
    return (
        <VStack alignItems={"flex-end"} justifyItems="flex-end" mb={5}>
            <ButtonGroup>
                <Button leftIcon={<AddIcon />} variant={"outline"} colorScheme={"purple"} onClick={() => router.push("/payment/one-time")}>NEW ONE TIME PAYMENTS</Button>
                <Button leftIcon={<RepeatClockIcon />} variant={"outline"} colorScheme={"blue"} onClick={() => router.push("/payment/recurring")}>NEW RECURRING PAYMENTS</Button>
            </ButtonGroup>
        </VStack>
    )
}