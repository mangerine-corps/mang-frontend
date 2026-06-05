//import { Geist, Outfit } from "next/font/google";
import {
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Logo } from "mangarine/components/Logo";
import { useColorMode } from "mangarine/components/ui/color-mode";
import { usePersistReady } from "mangarine/components/ui/provider";
import { outfit } from "./_app";
import { CustomLink } from "mangarine/components/Button";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useEffect, useState } from "react";
import { isEmpty } from "es-toolkit/compat";
import { useRouter } from "next/router";
import NextLink from "next/link";
import CustomButton from "mangarine/components/customcomponents/button";
import GuestLayout from "mangarine/layouts/GuestLayout";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export default function Home() {
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { token } = useAuth();
  const persistReady = usePersistReady();
  const router = useRouter();

  useEffect(() => {
    if (!persistReady) {
      return;
    }

    if (!isEmpty(token)) {
      router.replace("./home");
    }
  }, [persistReady, router, token]);

  if (!persistReady || !isEmpty(token)) {
    return null;
  }

  return (
    <GuestLayout>
      <VStack
        // bg="green.900"
        // h="95vh"
        flex={1}
        alignItems={"center"}
        // overflow="hidden"
        justifyContent={"Space-between"}
      >
        <VStack
          // flex={1}
          // mb="16"
          alignItems={"center"}
          justifyContent={{ base: "space-between", lg: "center" }}
          w="full"
          h="full"
          pt={{ base: "8", lg: "0" }}
          pb={{ base: "16", lg: "0" }}
          // bg="red.900"
        >
          {" "}
          <VStack>
            <Image
              boxSize={{ base: "20", md: "20", lg:"24" }} // fixed logo size
              objectFit="contain"
              src={
                !isClient
                  ? "/images/logo.svg"
                  : colorMode === "dark"
                    ? "/images/logoDark.svg"
                    : "/images/logo.svg"
              }
              alt="logo"
              h="full"
            />

            <Text
              lineHeight={"normal"}
              textAlign={"center"}
              color="text_primary"
              fontSize={{base:"1.5rem",md:"2rem",lg:"3rem"}}
              fontWeight="600"
            >
              Mangerine
            </Text>
          </VStack>
          <Box
            display={{ base: "block", lg: "none" }}
            w="65%"
          >
            <Image
              src="/images/onboarding-card.png"
              alt="onboarding"
              w="full"
              objectFit="contain"
            />
          </Box>

          <VStack w="65%" spaceY={"5"} pt={{ base: "0", lg: "24" }}>
            <CustomButton
              customStyle={{
                w: "full",
                color: "button_text",
                h: "14",
              }}
              // loading={isLoading}
              onClick={() => {
                router.push("/auth/onboarding/register");
              }}
            >
              <Text
                color={"button_text"}
                fontWeight={"600"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Get Started
              </Text>
            </CustomButton>
            <CustomButton
              customStyle={{
                w: "full",
                py: "3",
                _hover: {
                  bg: "bg_box",
                },
                bg: "main_background",
                borderWidth: "2px",
                color: "button_text",
                h: "14",
                borderColor: "text_primary",
              }}
              // loading={isLoading}
              onClick={() => {
                router.push("/auth/login");
              }}
            >
              <Text
                color={"text_primary"}
                fontWeight={"600"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Login
              </Text>
            </CustomButton>
          </VStack>
        </VStack>

        <VStack
          flex={1}
          h="full"
          // mt="24"
          mb={{ base: 6 }}
          justifyContent={"flex-end"}
        >
          <Text
            lineHeight={0}
            textAlign={"center"}
            color="text_primary"
            fontSize={"10px"}
            fontWeight={"400"}
          >
            By signing up to create an account I accept Mangerine’s
          </Text>
          <HStack>
            <Link
              asChild
              color="text_primary"
              fontSize={"10px"}
              textAlign={"center"}
              fontWeight={"500"}
            >
              <NextLink href="/termsofservice">Terms of use &</NextLink>
            </Link>
            <Link
              asChild
              color="text_primary"
              fontSize={"10px"}
              textAlign={"center"}
              fontWeight={"500"}
            >
              <NextLink href="/privacypolicy">Privacy Policy.</NextLink>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </GuestLayout>
  );
}
