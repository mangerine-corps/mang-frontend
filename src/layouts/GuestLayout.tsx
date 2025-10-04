import { Flex, HStack } from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import OnboardingCarousel from "mangarine/components/customcomponents/carousel";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";

type Props = {
  children: React.ReactElement;
};

const GuestLayout: FC<Props> = ({ children }) => {

  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isEmpty(token)) {
      console.log(token)
      router.replace('/home')
    }
  }, [token,router])

  return (
    <HStack
      p={{base: 2,lg:"32px"}}
      bg="main_background"
      gap={0}
      spaceX={0}
      alignItems={"stretch"}
      justifyContent="center"
      mx="auto"
      minH='100vh'maxH={"100vh"}
      maxW="8xl"
      overflowY="hidden"
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
      <Flex
        display={{ base: "none",sm:"none", md: "none", lg:"flex" }}
        flex={1}
        h={"full"}
        overflow={"hidden"}
        maxW={"50%"}

      >
        <OnboardingCarousel />
      </Flex>
      <Flex
        flex={1}
        overflowY="auto"
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
        {children}
      </Flex>
    </HStack>
  );
};

export default GuestLayout;
