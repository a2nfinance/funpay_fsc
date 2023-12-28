import { Box, ButtonGroup } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";

export default function SaveBar() {
    const dispatch = useAppDispatch();
    const recurringPaymentsData = useAppSelector(state => state.batchRecurring);
    return (
        <Box 
        bg="purple.600"
        position={"fixed"}
        w="fit-content" bottom={0}>
            <ButtonGroup>
                
            </ButtonGroup>
           
        </Box>
    )
}