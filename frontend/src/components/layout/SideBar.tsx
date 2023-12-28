import {
    Box,
    Drawer,
    DrawerContent,
    Stack,
    useBreakpointValue,
    useDisclosure
} from '@chakra-ui/react';
import { ReactNode } from 'react';


import { useStyleConfig } from "@chakra-ui/react";
import { useAppSelector } from 'src/controller/hooks';
import { MobileNav } from './MobileNav';
import { SidebarContent } from './SidebarContent';


export default function SidebarWithHeader({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isHana = useAppSelector((state) => state.network.isHana);

    const sidebarWrapper = useStyleConfig("SidebarWrapper");
    return (
        <Box sx={sidebarWrapper}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: "270px" }} p="4">
                <Stack alignItems={"initial"} direction={useBreakpointValue({ base: "column", sm: "column", md: "column", lg: "column", xl: "row", "2xl": "row" })}>
                    <Box width={"full"}>
                        {children}
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}




