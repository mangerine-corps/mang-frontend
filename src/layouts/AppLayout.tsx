import { Box, Flex, Spinner, Center, VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react'
import Header from './Header';
import { usePersistReady } from 'mangarine/components/ui/provider';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import { SSENotificationProvider } from 'mangarine/contexts/SSENotificationContext';


type Props = {
  children: React.ReactElement;
  subHeader?: React.ReactNode;
}

const AppLayout: FC<Props> = ({ children, subHeader }) => {
  const { token, user } = useAuth()
  const persistReady = usePersistReady()
  const  router = useRouter()

  useEffect(() => {
    if (!persistReady) {
      return
    }

    if(isEmpty(token)){
      // console.log("token is empty")
      router.replace('/auth/login')
    }
  }, [persistReady, token,router])

  // Don't render anything until the persisted Redux store has rehydrated.
  // This prevents children from rendering with null auth state on refresh,
  // which was causing intermittent blank screens.
  if (!persistReady) {
    return (
      <Center h="100vh" bg="main_background">
        <Spinner size="lg" color="text_primary" />
      </Center>
    );
  }

  return (
    <SSENotificationProvider
      userId={persistReady ? user?.id : undefined}
      options={persistReady && user?.id ? { mode: 'secure', token, autoReconnect: true } : undefined}
    >
      <VStack gap={0} h="100vh" alignItems="stretch">
        <Header />

        {subHeader ? (
          <Box
            w="full"
            bg="main_background"
            px={{ base: "12px", md: "16px", lg: "18px", xl: "32px" }}
            borderBottomWidth="1px"
            borderColor="input_border"
            mb={{ base: "12px", md: "16px" }}
          >
            {subHeader}
          </Box>
        ) : (
          <Box mb={{ base: "12px", md: "16px" }} />
        )}

        <Flex
          flex={1}
          minH={0}
          w="full"
          px={{ base: "12px", md: "16px", lg: "18px", xl: "32px" }}
          overflow={{ base: "auto", md: "hidden" }}
          css={{
            "&::-webkit-scrollbar": { width: "0px", height: "0px" },
            "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
            "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", maxHeight: "0px", height: "0px", width: 0 },
          }}
        >
          {children}
        </Flex>
      </VStack>
    </SSENotificationProvider>
  );
}

export default AppLayout
