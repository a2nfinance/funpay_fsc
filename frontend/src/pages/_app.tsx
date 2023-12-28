import { Box, ChakraProvider, Container } from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/toast';
import Head from 'next/head';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import SidebarWithHeader from "../components/layout/SideBar";
import { persistor, store } from "../controller/store";
import { theme } from "../theme/theme";
const { ToastContainer } = createStandaloneToast()

function MyApp({ Component, pageProps }) {


    return (
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                < //@ts-ignore
                    PersistGate loading={null} persistor={persistor}>
                    <Box>
                        <Head>
                            <title>Batch Pay & Recurring Pay</title>
                        </Head>
                        <Container maxW={"container.3xl"} p={0}>
                            <SidebarWithHeader>
                                <Box margin="auto">
                                <Component {...pageProps} />
                                </Box>
                                    
                            </SidebarWithHeader>
                        </Container>
                        <ToastContainer />

                    </Box>


                </PersistGate>
            </Provider>
        </ChakraProvider>
    )
}

export default MyApp