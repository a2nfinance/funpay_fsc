
import { createStandaloneToast } from '@chakra-ui/toast';
import { messages } from "./message";

const { toast } = createStandaloneToast();
export const requiredWalletToastContent = (walletName?: string) => {
    toast({
        title: 'An error occurred.',
        description: `Please install ${walletName ? walletName : "Metamask"} wallet!`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
    })
}

export const errorToastContent = (e: any, description?: string) => {
    return toast( {
        title: 'An error occurred.',
        description: description ? description : (messages[e.code] ? messages[e.code] : e.code),
        status: 'error',
        duration: 5000,
        isClosable: true,
    })
}

export const successToastContent = (title: string, description: string) => {
    toast({
        title: title,
        description: description,
        status: 'success',
        duration: 5000,
        isClosable: true,
    })
}