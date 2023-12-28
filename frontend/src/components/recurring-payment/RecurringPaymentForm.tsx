import { DownloadIcon, DragHandleIcon, TimeIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Card,
    CardBody, CardFooter,
    CardHeader,
    FormControl,
    FormLabel,
    HStack,
    Input, InputGroup, InputLeftAddon,
    Select, SimpleGrid,
    useColorModeValue,
    VStack
} from "@chakra-ui/react";
import { parse } from "csv";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    BsPersonCheck,
    BsPersonDash
} from 'react-icons/bs';
import { userPermissions } from "src/config/permission";
import { addNewRecipients, changeGeneralSetting } from "src/controller/batch-recurring/multipleRecurringPaymentSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import TokenSelector from "../common/TokenSelector";
export default function RecurringPaymentForm() {
    const dispatch = useAppDispatch();
    const {generalSetting} = useAppSelector(state => state.batchRecurring);

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
    
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading failed");
        reader.onload = () => {
          // Parse CSV file
          // @ts-ignore
          parse(reader.result, (err, data) => {
            data.shift();
            let recipients = data.map(item => {
                return {
                    recipient: item[0],
                    numberOfUnlocks: parseInt(item[1]),
                    unlockAmountPerTime: parseFloat(item[2]),
                    unlockEvery: parseInt(item[3]),
                    unlockEveryType: parseInt(item[4]),
                    prepaidPercentage: parseInt(item[5])
                }
            });
            dispatch(addNewRecipients(recipients));
          });
        };
    
        // read file contents
        acceptedFiles.forEach(file => reader.readAsBinaryString(file));
      }, []);


      const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

      const handleChangeSetting  = useCallback((att: string, value: any) => {
        dispatch(changeGeneralSetting({att, value}));
      }, [])


    return (
        <SimpleGrid columns={{base: 1, lg: 2}} spacing={5}>
            <Card>
                <CardHeader>General settings</CardHeader>
                <CardBody>

                <VStack>
                    <FormControl>
                        <FormLabel>Select Token</FormLabel>
                        <TokenSelector handleOnChange={handleChangeSetting}/>
                        
                    </FormControl>
                        <FormControl>
                            <FormLabel>Start Date</FormLabel>

                            <InputGroup>
                                <InputLeftAddon
                                    pointerEvents='none'
                                    children={<TimeIcon />}
                                />
                                <Input type='datetime-local' placeholder='Name' onChange={(e) => handleChangeSetting("startDate", new Date(e.target.value).getTime())}/>
                            </InputGroup>
                        </FormControl>
                    <HStack gap={4} width="full">
                        <FormControl>
                            <FormLabel>Who can cancel</FormLabel>
                            <InputGroup>
                                    <InputLeftAddon children={<BsPersonDash />} />
                                    <Select onChange={(e) => handleChangeSetting("whoCanCancel", e.target.value)}>
                                        {
                                            userPermissions.map((p, index) => {
                                                return <option key={`cancel-${index}`} value={p.value}>{p.label}</option>
                                            })
                                        }
                                    </Select>
                               
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Who can transfer</FormLabel>
                            <InputGroup>
                            <InputLeftAddon children={<BsPersonCheck />} />
                                <Select  onChange={(e) => handleChangeSetting("whoCanTransfer", e.target.value)}>
                                {
                                            userPermissions.map((p, index) => {
                                                return <option key={`transfer-${index}`} value={p.value}>{p.label}</option>
                                            })
                                        }
                                </Select>
                            </InputGroup>
                        </FormControl>
                    </HStack>
                    


                </VStack>
                </CardBody>
            </Card>
              <Card>
                <CardHeader>Upload Recipients</CardHeader>
                <CardBody>
                <VStack>
                <Box 
                w={"full"} 
                py="100px" 
                textAlign={"center"}
                border={useColorModeValue("2px dotted blue", "1px dotted white")} 
                {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p><DragHandleIcon /> Drop 'n' Drag .csv file here or click to upload</p>
                </Box>
                </VStack>
                </CardBody>
                <CardFooter>
                    <Button colorScheme={"purple"} onClick={() => window.open("/recipients_sample_file.csv")} leftIcon={<DownloadIcon />} variant={"ghost"}>Download sample CSV file</Button>
                </CardFooter>
              </Card>
                
                </SimpleGrid>
    )
}