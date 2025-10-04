import { Flex, VStack } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react'
import Header from './Header';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'next/router';


type Props = {
  children: React.ReactElement
}

const AppLayout: FC<Props> = ({ children }) => {
  const {token} = useAuth()
  const  router = useRouter()

  useEffect(() => {
    if(isEmpty(token)){
      // console.log("token is empty")
      router.replace('/auth/login')
    }
  }, [token,router])

  return (
    <VStack
      // px={"36px"}
      // py="12px"
      // bg="main_background"
      gap={0}
      h="full"
      spaceX={0}
      alignItems={"stretch"}
      justifyContent="center"
      mx="auto"
      // minH='3xl'
      maxW={{ base: "100%", md: "100%", lg: "8xl", xl: "8xl" }}
      overflowY="scroll"
      css={{
        "&::-webkit-scrollbar": {
          width: "0px",

          height: "0px",
        },
        "&::-webkit-scrollbar-track": {
          width: "0px",
          background: "transparent",

          height: "0px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
          borderRadius: "0px",
          maxHeight: "0px",
          height: "0px",
          width: 0,
        },
      }}
    >
      <Header />

      <Flex
        flex={1}
        minH="80vh"
        // bg="bg_box"
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",

            height: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
            background: "transparent",

            height: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "0px",
            maxHeight: "0px",
            height: "0px",
            width: 0,
          },
        }}
        overflowY="scroll"
        // bg="green.900"
      >
        {children}
      </Flex>
    </VStack>
  );
}

export default AppLayout
