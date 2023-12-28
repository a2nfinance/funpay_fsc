import { MoonIcon, SearchIcon, SunIcon } from "@chakra-ui/icons";
import { Button, Flex, FlexProps, HStack, IconButton, Image, Input, InputGroup, InputLeftElement, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useAppSelector } from "src/controller/hooks";
import { connectWallet } from "src/core";
import { useAddress } from "src/hooks/useAddress";

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { getShortAddress } = useAddress();
    const { colorMode, toggleColorMode } = useColorMode();
    const {account, isConnected} = useAppSelector(state => state.network);
    function connect(chain: string) {
        connectWallet(chain);
    }
    return (
        <Flex
            ml={{ base: 0, md: "270px" }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            // bg={useColorModeValue('white', 'gray.900')}
            // borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end', lg: "space-between" }}
            {...rest}>
            <Flex>
                <InputGroup maxW={"300px"} display={{base: "none", lg: "flex"}} >
                    <InputLeftElement
                        pointerEvents='none'
                        children={<SearchIcon color='gray.300' />}
                    />
                    <Input bg={useColorModeValue("whiteAlpha.700", "gray.800")} borderRadius="20px" type='text' placeholder='Search address' />
                </InputGroup>
                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onOpen}
                    variant="outline"
                    aria-label="open menu"
                    icon={<FiMenu />}
                />
                <Image ml={1} display={{ base: 'flex', md: 'none' }} src={useColorModeValue("/logo.png", "/logo.png")} width={"120px"} />
            </Flex>


            <HStack spacing={{ base: '0', md: '6' }}>
                <Button colorScheme={"purple"} variant="outline" onClick={toggleColorMode} fontSize={"sm"} mr={1}>
                    {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>

                <Button
                    variant={'outline'}
                    onClick={() => connect(process.env.NEXT_PUBLIC_DEFAULT_CHAIN)}
                    display={{ base: 'inline-flex', md: 'inline-flex'}}
                    // fontSize={'xs'}
                    // letterSpacing={"1px"}
                    colorScheme="blue"
                    //color="white"
                    // bg={'purple.400'}
                    gap={2}
                    leftIcon={<MdAccountBalanceWallet fontSize={"sm"} />}>
                    {/*{ isConnected ? <Image src={"/networks/metamask.svg"} width={"20px"} /> : <></>}*/}
                    { isConnected ? `${getShortAddress(account)}`: "Connect Wallet" }
                </Button>

            </HStack>

        </Flex>
    );
};