import { Flex, VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react'
import Header from './Header';
import { usePersistReady } from 'mangarine/components/ui/provider';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import { SSENotificationProvider } from 'mangarine/contexts/SSENotificationContext';


type Props = {
  children: React.ReactElement
}

const AppLayout: FC<Props> = ({ children }) => {
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

  return (
    <SSENotificationProvider
      userId={persistReady ? user?.id : undefined}
      options={persistReady && user?.id ? { mode: 'secure', token, autoReconnect: true } : undefined}
    >
      <VStack gap={0} h="full" alignItems="stretch">
        <Header />

        <Flex
          flex={1}
          minH="80vh"
          w="full"
          px={{ base: "12px", md: "16px", lg: "18px", xl: "32px" }}
          overflowY="scroll"
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
