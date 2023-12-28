import { TimeIcon } from "@chakra-ui/icons";
import {
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Input, InputGroup,
    InputLeftAddon,
    Radio,
    RadioGroup,
    Stack,
    VStack
} from "@chakra-ui/react";
import { useCallback } from "react";
import { changeGeneralSetting } from "src/controller/batch-payment/batchPaymentSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import TokenSelector from "../common/TokenSelector";



export default function OneTimePaymentForm() {
    const dispatch = useAppDispatch();
    const {generalSetting} = useAppSelector(state => state.batchPayment);
    
    const handleOnChange = useCallback((att: string, value: string | number | boolean ) => {
         dispatch(changeGeneralSetting({att, value}));
    }, [])
    return (
        <Card>
            <CardHeader>
                Payment Settings
            </CardHeader>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Select Token</FormLabel>
                        <TokenSelector handleOnChange={handleOnChange} />
                    </FormControl>
                    
                        <FormControl>
                            <FormLabel>Pay</FormLabel>

                            <RadioGroup onChange={value => handleOnChange("isPayNow", (value == "true" ? true : false))} value={generalSetting.isPayNow.toString()}>
                                <Stack direction='row'>
                                    <Radio value='true'>Now</Radio>
                                    <Radio value='false'>On specific date</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel></FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<TimeIcon />}
                                />
                                <Input disabled={generalSetting.isPayNow} type='datetime-local' placeholder='Name' onChange={(e) => handleOnChange("startDate", new Date(e.target.value).getTime())}/>
                            </InputGroup>
                        </FormControl>
                    
                </VStack>

            </CardBody>
        </Card>

    )
}