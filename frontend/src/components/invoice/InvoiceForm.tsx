import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    VStack
} from "@chakra-ui/react";
import { useCallback } from "react";
import {
    AiOutlineDollarCircle,
    AiOutlineTags
} from "react-icons/ai";
import { MdClear } from "react-icons/md";
import { fiats } from "src/config/invoice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { createInvoiceThunk } from "src/controller/invoice/createInvoiceThunk";
import { changeGeneralSetting } from "src/controller/invoice/invoiceSlice";
import { actionNames, processKeys, updateProcessStatus } from "src/controller/process/processSlice";
import AddressField from "../address-book/AddressField";
import TokenSelector from "../common/TokenSelector";
import InvoiceItems from "./InvoiceItems";



export default function InvoiceForm() {
    const dispatch = useAppDispatch();
    const {createInvoice} = useAppSelector(state => state.process);
    const handleUpdate = useCallback((att: string, value: string | number) => {
        dispatch(changeGeneralSetting({att, value}));
    }, [])
    const handleSave = useCallback(() => {
        dispatch(updateProcessStatus({
            actionName: actionNames.createInvoice,
            att: processKeys.processing,
            value: true
        }))
        dispatch(createInvoiceThunk());
    }, [])
    return (
        <Card>
            <CardHeader>
                New Invoice
            </CardHeader>
            <CardBody>
                <VStack>
                    <AddressField label={"Your Client"} att="recipient" placeHolder="" handleChange={handleUpdate} />
                    <HStack gap={4} width={"full"}>

                        <FormControl>
                            <FormLabel>Fiat</FormLabel>
                            <InputGroup>
                            <InputLeftAddon pointerEvents={"none"} children={<AiOutlineDollarCircle />} />
                            <Select onChange={(e) => handleUpdate("fiat", e.target.value)}>
                                {
                                    fiats.map(fiat => {
                                        return <option value={fiat.value}>{fiat.label}</option>
                                    })
                                }
                            </Select>
                            </InputGroup>
                            
                        </FormControl>
                        <FormControl>
                            <FormLabel>Token</FormLabel>

                            <TokenSelector handleOnChange={handleUpdate} />
                        </FormControl>
                    </HStack>
                    <HStack gap={4} width={"full"}>
                        <FormControl>
                            <FormLabel>Category associated to your invoice</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<HamburgerIcon />}
                                />
                                <Input type='text' onChange={(e) => handleUpdate("category", e.target.value)} placeholder='Category' />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Tags associated to your invoice</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<AiOutlineTags />}
                                />
                                <Input type='text' onChange={(e) => handleUpdate("tags", e.target.value)} placeholder='Tags' />
                            </InputGroup>
                        </FormControl>
                    </HStack>
                    <InvoiceItems />
                </VStack>

            </CardBody>
            <CardFooter justifyContent={"center"} >
                <ButtonGroup spacing='10'>
                    <ButtonGroup>
                        <Button onClick={() => handleSave()} isLoading={createInvoice.processing} leftIcon={<SettingsIcon />} variant={"outline"} colorScheme={"blue"}>SAVE</Button>
                        <Button leftIcon={<MdClear />} variant={"outline"} colorScheme={"purple"}>RESET</Button>
                    </ButtonGroup>
                </ButtonGroup>
            </CardFooter>
        </Card>

    )
}