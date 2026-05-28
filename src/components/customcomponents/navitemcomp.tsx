
import {
  Text,
  Box,
  VStack,
  Image,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { NavLink } from "./navitems";
import { outfit } from "mangarine/pages/_app";
import { useColorMode } from "../ui/color-mode";
import { useState, useEffect } from "react";

interface Props {
  link: NavLink;
  isMobile?: boolean;
}

export const NavItem: React.FC<Props> = ({ link, isMobile }) => {
  const pathname = usePathname();
  const normalizedHref = link.href.endsWith("/") && link.href !== "/" ? link.href.slice(0, -1) : link.href;
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const isNotificationAlias = normalizedHref === "/notification" && normalizedPath === "/notifications";
  const isActive =
    isNotificationAlias ||
    normalizedPath === normalizedHref ||
    (normalizedHref !== "/home" && normalizedPath.startsWith(`${normalizedHref}/`));
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <LinkBox w={isMobile ? "full" : "auto"}>
        <LinkOverlay href={link.href}>
          <VStack
            gap={isMobile ? 2 : 1}
            w={isMobile ? "full" : "auto"}
            bg={isMobile && isActive ? "#111D4A" : "transparent"}
            minW={isMobile ? "full" : "78px"}
            px={isMobile ? 4 : 2}
            py={isMobile ? 2 : 1}
            pb={isMobile ? 2 : 2}
            rounded={isMobile ? "md" : "none"}
            borderBottom={!isMobile && isActive ? "2px solid" : "2px solid transparent"}
            borderColor={!isMobile && isActive ? "#1D2A60" : "transparent"}
            color={isMobile && isActive ? "white" : isActive ? "#1D2A60" : colorMode === "dark" ? "whiteAlpha.800" : "#4B4B52"}
            _hover={{
              color: isMobile ? "white" : "#1D2A60",
              bg: isMobile ? "#111D4A" : "transparent",
              borderColor: isMobile ? "transparent" : "#D9DDE8",
            }}
            transition="all 0.2s"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent={isMobile ? "flex-start" : "center"}
            flexDir={{ base: "row", md: "column", lg: "column", xl: "column" }}
          >
            <Box
              boxSize={isMobile ? "20px" : "22px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              filter={isMobile && isActive ? "brightness(0) invert(1)" : "none"}
            >
              {!isClient ? (
                <Box boxSize="full">
                  <Image
                    alt={"nav icons"}
                    h="full"
                    w="full"
                    src={link.icon.light}
                  />
                </Box>
              ) : colorMode === "dark" ? (
                <>
                  {isActive ? (
                    <Box boxSize="full">
                      <Image
                        alt={"nav icons"}
                        h="full"
                        w="full"
                        src={link.iconActive.dark}
                      />
                    </Box>
                  ) : (
                    <Box boxSize="full">
                      <Image
                        alt={"nav icons"}
                        h="full"
                        w="full"
                        src={link.icon.dark}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {isActive ? (
                    <Box boxSize="full">
                      <Image
                        alt={"nav icons"}
                        h="full"
                        w="full"
                        src={link.iconActive.light}
                      />
                    </Box>
                  ) : (
                    <Box boxSize="full">
                      <Image
                        alt={"nav icons"}
                        h="full"
                        w="full"
                        src={link.icon.light}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
            <Text
              className={outfit.className}
              fontSize={isMobile ? "0.95rem" : "0.74rem"}
              fontWeight={isActive ? "600" : "500"}
              lineHeight="1.1"
              textAlign="center"
              whiteSpace="nowrap"
            >
              {link.label}
            </Text>
          </VStack>
        </LinkOverlay>
      </LinkBox>
    </>
  );
};
