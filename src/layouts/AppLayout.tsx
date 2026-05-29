import { Box, Flex, HStack, Skeleton, SkeletonCircle, VStack } from '@chakra-ui/react';
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
      <VStack gap={0} h="100vh" alignItems="stretch" bg="main_background">
        {/* Header skeleton */}
        <HStack
          h="88px"
          px={{ base: 4, md: 5, lg: 6 }}
          borderBottomWidth="1px"
          borderColor="gray.100"
          bg="white"
          gap={6}
          flexShrink={0}
        >
          <SkeletonCircle size="9" flexShrink={0} />
          <Skeleton h="9" w="280px" rounded="xl" />
          <Box flex={1} />
          <HStack gap={6} display={{ base: "none", lg: "flex" }}>
            {[80, 64, 80, 72].map((w, i) => (
              <Skeleton key={i} h="10" w={`${w}px`} rounded="lg" />
            ))}
          </HStack>
          <SkeletonCircle size="9" flexShrink={0} />
        </HStack>

        {/* Content skeleton — 3-column layout */}
        <Flex
          flex={1}
          minH={0}
          px={{ base: 3, md: 4, lg: 6, xl: 8 }}
          py={4}
          gap={4}
          overflow="hidden"
        >
          {/* Left sidebar */}
          <VStack
            w="260px"
            flexShrink={0}
            gap={3}
            display={{ base: "none", md: "flex" }}
            align="stretch"
          >
            <Skeleton h="200px" rounded="xl" />
            <Skeleton h="280px" rounded="xl" />
          </VStack>

          {/* Center feed */}
          <VStack flex={1} gap={3} align="stretch" overflow="hidden">
            <Skeleton h="80px" rounded="xl" />
            {[1, 2, 3].map((i) => (
              <Box key={i} bg="white" rounded="xl" p={5}>
                <HStack gap={3} mb={4}>
                  <SkeletonCircle size="10" flexShrink={0} />
                  <VStack align="flex-start" gap={2} flex={1}>
                    <Skeleton h="3" w="35%" />
                    <Skeleton h="2.5" w="20%" />
                  </VStack>
                </HStack>
                <Skeleton h="3" w="full" mb={2} />
                <Skeleton h="3" w="90%" mb={2} />
                <Skeleton h="3" w="75%" mb={4} />
                <Skeleton h="160px" rounded="lg" />
              </Box>
            ))}
          </VStack>

          {/* Right sidebar */}
          <VStack
            w="260px"
            flexShrink={0}
            gap={3}
            display={{ base: "none", lg: "flex" }}
            align="stretch"
          >
            <Skeleton h="180px" rounded="xl" />
            <Skeleton h="220px" rounded="xl" />
            <Skeleton h="240px" rounded="xl" />
          </VStack>
        </Flex>
      </VStack>
    );
  }

  return (
    <SSENotificationProvider
      userId={persistReady ? user?.id : undefined}
      options={persistReady && user?.id ? { mode: 'secure', token, autoReconnect: true } : undefined}
    >
      <VStack gap={0} h={{ base: "auto", md: "100vh" }} minH={{ base: "100vh", md: "unset" }} alignItems="stretch">
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
          overflow={{ base: "visible", md: "hidden" }}
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
