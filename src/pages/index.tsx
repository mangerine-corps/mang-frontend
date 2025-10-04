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
import { outfit } from "./_app";
import { CustomLink } from "mangarine/components/Button";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useEffect, useState } from "react";
import { isEmpty } from "es-toolkit/compat";
import { useRouter } from "next/router";
import CustomButton from "mangarine/components/customcomponents/button";
import GuestLayout from "mangarine/layouts/GuestLayout";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export default function Home() {
  const bg1 = "url(/images/bg2.svg)";
  const bg1Dark = "url(/images/bg2.svg)";
  const banner3 = "/images/banner3.svg";
  const banner4 = "/images/banner3Dark.svg";
  //const logo = "/images/logoDark.svg";
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const img = `${!isClient ? bg1 : colorMode === "dark" ? bg1Dark : bg1}`;
  const img2 = `${!isClient ? banner3 : colorMode === "dark" ? banner4 : banner3}`;
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isEmpty(token)) {
      router.replace("./home");
    }
  }, [router, token]);

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
          justifyContent={"center"}
          w="full"
          h="full"
          // h=""
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
          <VStack w="65%" spaceY={"5"} pt="24">
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
              href="/privacypolicy"
              color="text_primary"
              fontSize={"10px"}
              textAlign={"center"}
              fontWeight={"500"}
            >
              Terms of use &
            </Link>
            <Link
              href="/privacypolicy"
              color="text_primary"
              fontSize={"10px"}
              textAlign={"center"}
              fontWeight={"500"}
            >
              Privacy Policy.
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </GuestLayout>
  );
}
