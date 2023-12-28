import { Box, BoxProps, CloseButton, Flex, Image, List, ListIcon, ListItem, VStack, useColorModeValue, useStyleConfig } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

import {
    FiHome
} from 'react-icons/fi';
import {
    MdAccountBalance,
    MdPayment
} from 'react-icons/md';
import {
    RiBillLine
} from "react-icons/ri";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    FaRegAddressBook
} from "react-icons/fa";

interface LinkItemProps {
    name: string;
    icon?: IconType;
    url?: string
    children?: LinkItemProps[]
}
const LinkItems: Array<LinkItemProps> = [
    {
        name: 'Home',
        icon: FiHome,
        url: "/"
    },
    {
        name: 'My Balance',
        icon: MdAccountBalance,
        url: "/account/balance"
    },
    {
        name: "Address Book",
        icon: FaRegAddressBook,
        url: "/address-book",
    },
    {
        name: 'Payment',
        icon: MdPayment,
        url: "/payment",
        children: [
            {
                name: "Sent Payments",
                url: "/payment/sent"
            },
            {
                name: "Received Payments",
                url: "/payment/received"
            }
        ]
    },
    {
        name: 'Invoices',
        icon: RiBillLine,
        url: "/invoices/",
        children: [
            {
                name: "New Invoice",
                url: "/invoices/new"
            },
            {
                name: "Sent Invoices",
                url: "/invoices/sent"
            },
            {
                name: "Received Invoices",
                url: "/invoices/received"
            }
        ]
    }
];

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const router = useRouter();
    const sidebarContainer = useStyleConfig("SidebarContainer");
    const navItemFlex = useStyleConfig("NavItemFlex");
    const navItemIcon = useStyleConfig("NavItemIcon");
    return (
        <Box
            sx={sidebarContainer}
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Image src={useColorModeValue(`/${process.env.NEXT_PUBLIC_DEFAULT_CHAIN}/logo.png`, `/${process.env.NEXT_PUBLIC_DEFAULT_CHAIN}/logo.png`)} width={{ base: "100", lg: 150 }} />
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            <VStack alignItems={"flex-start"} p={4}>
                <List>
                    {
                        LinkItems.map((link, parentIndex) => {
                            if (link.children && link.children.length) {
                                return <ListItem key={`parent-menu-${parentIndex}`} sx={navItemFlex}>
                                    <ListIcon as={link.icon} sx={navItemIcon} />
                                    {link.name}
                                    <List >
                                        {
                                            link.children.map((sublink, childIndex) => {
                                                return <ListItem key={`child-menu-${parentIndex}-${childIndex}`} cursor="pointer" pt={childIndex == 0 ? 5 : 4} onClick={() => router.push(sublink.url)}>
                                                    <ListIcon as={ChevronRightIcon} mr={5} />
                                                    {sublink.name}
                                                </ListItem>
                                            })
                                        }
                                    </List>
                                </ListItem>
                            }
                            return <ListItem key={`parent-menu-${parentIndex}`} cursor="pointer" sx={navItemFlex} onClick={() => router.push(link.url)}>
                                <ListIcon as={link.icon} sx={navItemIcon} />
                                {link.name}
                            </ListItem>
                        })
                    }
                </List>

            </VStack>
        </Box>
    );
};
