import { Box, Flex, VStack, Spinner } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react'
import Header from './Header';
import { usePersistReady } from 'mangarine/components/ui/provider';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import { SSENotificationProvider } from 'mangarine/contexts/SSENotificationContext';
import Biocard from 'mangarine/components/ui-components/biocard';
import DashboardCard from 'mangarine/components/ui-components/dashboardcard';

// Routes that show the profile sidebar (Biocard + DashboardCard)
const SIDEBAR_ROUTES = new Set([
  '/home', '/home1', '/search', '/notification', '/payment-success',
  '/consultant-learn-more', '/consultant', '/consultation',
  '/consultation/view', '/consultation/reschedule', '/consultation/cancel',
  '/groups', '/jobs', '/jobs/create', '/jobs/search',
  '/jobs/[jobId]', '/posts/[postId]',
]);

// Routes accessible without authentication
const PUBLIC_ROUTES = new Set(['/posts/[postId]']);

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

type Props = {
  children: React.ReactElement;
}


const AppLayout: FC<Props> = ({ children }) => {
  const { token, user } = useAuth()
  const persistReady = usePersistReady()
  const router = useRouter()
  const showSidebar = SIDEBAR_ROUTES.has(router.pathname)

  const isPublic = PUBLIC_ROUTES.has(router.pathname);

  useEffect(() => {
    if (!persistReady) return;
    if (isEmpty(token) && !isPublic) {
      router.replace('/auth/login');
    }
  }, [persistReady, token, router, isPublic])

  return (
    <SSENotificationProvider
      userId={user?.id}
      options={user?.id ? { mode: 'secure', token, autoReconnect: true } : undefined}
    >
      <VStack gap={0} h={{ base: "auto", md: "100vh" }} minH={{ base: "100vh", md: "unset" }} alignItems="stretch">
        <Header />

        <Box mb={{ base: "12px", md: "16px" }} />

          <Flex
            flex={1}
            minH={0}
            w="full"
            overflow={{ base: "visible", md: "hidden" }}
            justify="center"
            css={noScrollbar}
          >
            <Flex
              flex={1}
              minH={0}
              w="full"
              maxW="1400px"
              px={{ base: "10px", md: "16px", lg: "20px", xl: "24px" }}
              gap={4}
            >
              {showSidebar && !isEmpty(token) && (
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="stretch"
                  spaceY={2}
                  w="260px"
                  flexShrink={0}
                  h={{ base: "auto", md: "full" }}
                  overflowY="auto"
                  css={noScrollbar}
                >
                  <Biocard />
                  <DashboardCard />
                </VStack>
              )}

              <Box
                flex={1}
                minH={0}
                h={{ base: "auto", md: "full" }}
                overflow={{ base: "visible", md: "hidden" }}
              >
                {!persistReady ? (
                  <Box h="full" display="flex" alignItems="center" justifyContent="center">
                    <Spinner size="lg" color="button_bg" />
                  </Box>
                ) : children}
              </Box>
            </Flex>
          </Flex>
      </VStack>
    </SSENotificationProvider>
  );
}

export default AppLayout
